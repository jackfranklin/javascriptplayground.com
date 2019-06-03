---
layout: post
title: "Making unit tests fail when PropTypes error"
intro: Documenting components with React's PropTypes library is a great way to be notified when you've forgotten to pass a certain prop. Today we're going to see how we can leverage these to make our tests fail when our PropTypes are incorrect.
---

PropTypes are a great way to document your components and I generally advise
that everyone do this fairly strictly. In fact, we have an ESLint rule that
ensures all PropTypes are declared.

> If you're using TypeScript/Flow, you don't need to be using PropTypes.

I always appreciate a PropTypes warning in the browser; it normally makes me
aware of a mistake I've made way before I've noticed it myself and I'm confident
that over the years PropTypes have saved me a lot of time debugging.

## Missing PropType warnings in test runs

When running our test suite with Jest, I noticed that I'd often miss the console
warnings that the PropTypes library emits if some tests fail, particularly if
I'm running multiple tests and so recently I set about trying to improve this. I
wanted to make the errors as obvious as possible, so you couldn't miss them.

For our test today we're using a `ProductPrice` component we have at work which
(you guessed it!) shows the price of an item to the user. IT also has some logic
to show the previous price crossed out, so users are shown if the item is on
sale.

Here's the test we'll be working with (we're using Enzyme for this test, but you
can use whichever library you'd like):

```js
describe('ProductPrice', () => {
  it('Shows previous price', () => {
    const props = {
      pricing: {
        price: {
          currency: 'GBP',
          amount: 4500,
        },
        fullPrice: {
          currency: 'GBP',
          amount: 5400,
        },
      },
    }

    const wrapper = mount(
      <ProductPrice {...props} priceMatchUrl="/price-match" />
    )

    expect(wrapper.find('strike').text()).toEqual('£54')
  })
})
```

Now let's deliberately break this test, by removing the `pricing.price` prop,
and see what the output looks like from Jest (I've removed some output to keep
this post a bit shorter!):

```
 FAIL  frontend/components/product/price.test.jsx
  ● ProductPrice › Shows previous price

    Method “text” is meant to be run on 1 node. 0 found instead.

      29 |     );
      30 |
    > 31 |     expect(wrapper.find('strike').text()).toEqual('£54');
         |                                   ^
      32 |   });
      33 | });
      34 |

      at ReactWrapper.single (../node_modules/enzyme/build/ShallowWrapper.js:1958:17)

  console.error node_modules/prop-types/checkPropTypes.js:20
    Warning: Failed prop type: The prop `pricing.price.currency` is marked as required in `ProductPrice`, but its value is `undefined`.
        in ProductPrice
```

Notice that we do get the PropTypes warning appear, but it's right at the
bottom. It's easy to spot in this small example where I'm running a single test,
but normally I'm running a whole file as I'm building or editing something, and
if you have a few failures it can be hard to trace back the PropTypes warnings
to the specific test that caused them. The main bit of output that I'm drawn to
is the main test error:

```
Method “text” is meant to be run on 1 node. 0 found instead.
```

And this isn't telling me too much; it tells me that `wrapper.find('strike')`
didn't succeed, but I don't know the root cause. I can go digging around, but if
this clearly told me I'd missed a PropType, that would give me a clear first
instruction that fixing the PropTypes would be a solid first step.

## Failing unit tests for PropTypes warnings

By default a PropType warning, which is just a `console.error` call, will never
fail a test. But that's what I'd like it to do. I want to fail a test on a
PropType warning every time. Not only does it help with debugging, it also means
our PropTypes are being used and are up to date with the real props we're
passing.

To do this we can create a setup file that Jest will run before tests and use
Jest's spying mechanism to spy on `console.error` calls, and check for calls
that look like PropType errors:

```js
const originalConsoleError = global.console.error

beforeEach(() => {
  global.console.error = (...args) => {
    const propTypeFailures = [/Failed prop type/, /Warning: Received/]

    if (propTypeFailures.some(p => p.test(args[0]))) {
      throw new Error(args[0])
    }

    originalConsoleError(...args)
  }
})
```

By swapping `global.console.error` for our own version we can track any calls.
If we find one that matches what we suspect is a PropType issue, we can
immediately throw an error. Throwing an error in a `beforeEach` will make Jest
fail that test, so this does the trick.

When we run the tests again, our output looks like this:

```
 FAIL  frontend/components/product/price.test.jsx
  ProductPrice
    ✕ Shows previous price (4ms)

  ● ProductPrice › Shows previous price

    Warning: Failed prop type: The prop `pricing.price.currency` is marked as required in `ProductPrice`, but its value is `undefined`.
        in ProductPrice

      28 |
      29 |     if (propTypeFailures.some(p => p.test(args[0]))) {
    > 30 |       throw new Error(args[0]);
         |             ^
      31 |     }
      32 |
      33 |     originalConsoleError(...args);
```

Whilst this isn't perfect (the stack trace for example is useless here), having
the warning front and centre right by the test failure makes it impossible to
miss. We can also go a bit further if we like by using
[Chalk](https://www.npmjs.com/package/chalk) to add some bold, red highlighting
to the error:

```js
if (propTypeFailures.some(p => p.test(args[0]))) {
  throw new Error(
    [chalk.red.bold('PropTypes caused test failure:'), chalk.red(args[0])].join(
      '\n'
    )
  )
}
```

## Conclusion

We've been very happy at work with this change; it's saved me from some
confusing debugging on multiple occasions. Regardless of if you want to do this
for your tests for PropTypes, I'd encourage you to look for ways that your test
output makes thing slightly less clear than it should be, and improve it.

Your tests are a tool for you and your team; if they are not working as well as
they could be for you a technique like the one we've used today for PropTypes
can be a great way to improve them.
