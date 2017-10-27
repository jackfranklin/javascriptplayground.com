---
layout: post
title: Extracting Logic from React Components
intro: Today we'll refactor a React component by pulling out logic that can live in its own module that we can test more easily.
githubPath: 2017-07-17-react-extracting-logic
---

In the [previous screencast](https://javascriptplayground.com/blog/2017/06/refactoring-react-tests/) we took a React component that was doing too much and refactored it, splitting it into two components that are easier to maintain, use and test. Although I'd recommend watching that video first, you don't need to have watched it to read this blog post. [You can find all the code on GitHub](https://github.com/javascript-playground/react-refactoring-with-tests) if you'd like to run it locally.

## The starting point

Let's start by looking at the `Money` component, that takes some value and formats it onto the page:

```js
class Money extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }

  getCurrencyData(currency) {
    return {
      GBP: { base: 100, symbol: '£' },
      USD: { base: 100, symbol: '$' },
    }[this.props.currency]
  }

  formatAmount(amount, base) {
    return parseFloat(amount / base).toFixed(2)
  }

  render() {
    const currency = this.getCurrencyData()
    if (currency) {
      const { symbol, base } = currency
      const formatted = this.formatAmount(this.props.amount, base)

      return (
        <span>{symbol}{formatted}</span>
      )
    } else {
      return <span>{this.props.amount}</span>
    }
  }
}
```

There's two parts of functionality here that I would look at extracting into a separate class:

- `getCurrencyData` fetches information on the given currency that is used for formatting the output. In reality this would be much larger and support more languages; so this is a good candidate to pull into a separate module.
- `formatAmount` takes the amount and the base and produces a formatted value. Sure, the logic is straightforward for now, but once we expand our application to support more languages, you can imagine this getting much more complex.

The reason that I want to extract these is so I can test them in complete isolation. Right now to test formatting of amounts I have to create and mount a React component, but I should be able to just call that function and check the result.

## Extracting amount formating

Let's create `src/format-currency.js` which will house the `formatAmount` function that is currently in our `Money` component.

```js
export const formatAmount = (amount, base) => {
  return parseFloat(amount / base).toFixed(2)
}
```

I've just lifted the function in its entirety to the new file and added an `export` to the beginning.

To test this, we can replace the body of `Money`'s `formatAmount` so that it just calls the new function from our `format-currency.js` module:

```js
import { formatAmount } from './format-currency'

class Money extends Component {
  ...
  formatAmount(amount, base) {
    return formatAmount(amount, base)
  }
  ...
}
```

Notice that I've still left the `formatAmount` function defined on `Money`; when pulling code apart like this you should do it in small steps; doing it like this decreases the chance of inadvertently breaking the code and also makes it easier to retrace your steps if something does go wrong.

Because these components are well tested, I can run `yarn test` to ensure everything passes, which it does.

Next up, I'll remove the `formatAmount` function from `Money` and update the `render` function to call our external function directly:

```js
// inside Money component
render() {
  const currency = this.getCurrencyData()

  if (currency) {
    const { symbol, base } = currency
    // this used to say this.formatAmount
    const formatted = formatAmount(this.props.amount, base)
  
    return (
      <span>{symbol}{formatted}</span>
    )
  } else {
    return <span>{this.props.amount}</span>
  }
}
```

Once again, `yarn test` confirms that we are good. Now all our original tests are passing, we can add some new tests to test `formatAmount in isolation. It's important to always do it this way round - get all your existing tests green before adding new ones.

```js
import { formatAmount } from './format-currency'

test('it formats the amount to 2 dp', () => {
  expect(formatAmount(2000, 100)).toEqual('20.00')
})

test('respects the base', () => {
  expect(formatAmount(2000, 10)).toEqual('200.00')
})

test('it deals with decimal places correctly', () => {
  expect(formatAmount(2050, 100)).toEqual('20.50')
})
```

We now have thorough tests for formatting amounts that are not attached to our React component at all. Sure, the `formatAmount` function is very straightforward for now, but as it grows we can now test it very easily without any need to fire up a React component to do so.

## Extracting the currency data

One down, one to go! Let's now pull out `getCurrencyData` using a very similar method to above. First, I'll create `currency-data.js` and pull our function over:


```js
export const getCurrencyData = currency => {
  return {
    GBP: { base: 100, symbol: '£' },
    USD: { base: 100, symbol: '$' },
  }[this.props.currency]
}
```

But wait! There's a bug - the function takes in a `currency` argument but actually completely ignores it in favour of `this.props.currency`. This is entirely accidental but shows the value of separating business logic from component UI logic. In a React component it's too easy to refer to `this.props` or `this.state` and it becomes hard to track which functions use which values. Pulling them out into their own modules forces you to pass arguments through, which in turn helps clarify the API and help you think about what data the function really needs.

Once I fix up that bug by making sure we call `getCurrencyData` with the right value, and update the function to refer to the `currency` argument, not `this.props.currency`, we can make `Money`'s `getCurrencyData` delegate to the new function:

```js
...
import { getCurrencyData } from './currency-data'

class Money extends Component {
  ...
  getCurrencyData(currency) {
    return getCurrencyData(currency)
  }

  render() {
    const currency = this.getCurrencyData(this.props.currency)
    ...
  }
}
```

And once again `yarn test` confirms that nothing has broken. Now we can make the next step of entirely deleting `getCurrencyData` in `Money` and just call the external function from `render`:

```js
render() {
  const currency = getCurrencyData(this.props.currency)
  ...
}
```

Now let's write somet tests for `getCurrencyData`:

```js
import { getCurrencyData } from './currency-data'

test('for GBP it returns the right data', () => {
  expect(getCurrencyData('GBP')).toEqual({
    base: 100,
    symbol: '£',
  })
})
```

For the sake of this tutorial - and also due to the data being simplified - I'll leave it there for tests for this function, but in a more complex situation we would write a full suite of tests as required.

## Slimming down the money component

Now, with everything passing, take a look at the `Money` implementation:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { formatAmount } from './format-currency'
import { getCurrencyData } from './currency-data'

class Money extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }

  render() {
    const currency = getCurrencyData(this.props.currency)
    if (currency) {
      const { symbol, base } = currency
      const formatted = formatAmount(this.props.amount, base)

      return (
        <span>{symbol}{formatted}</span>
      )
    } else {
      return <span>{this.props.amount}</span>
    }
  }
}

export default Money
```

`Money` has now just a single method, `render`, implemented. This is a great chance to move `Money` to a functional, stateless component (FSC). If you are not familiar with the how, whats and whys of FSCs, you can [read a previous blog post on the subject](https://javascriptplayground.com/blog/2017/03/functional-stateless-components-react/). I can now rewrite `Money` in this way:

```js
import React from 'react';
import PropTypes from 'prop-types'
import { formatAmount } from './format-currency'
import { getCurrencyData } from './currency-data'

const Money = ({ currency, amount }) => {
  const currencyData = getCurrencyData(currency)
  if (currencyData) {
    const { symbol, base } = currencyData
    const formatted = formatAmount(amount, base)

    return (
      <span>{symbol}{formatted}</span>
    )
  } else {
    return <span>{amount}</span>
  }

}

Money.propTypes = {
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
}

export default Money
```

I am a huge fan of FSCs; they encourage simple components and the separation of logic from UI, and it's no coincidence that by doing this refactoring today we've come to realise that our `Money` component can be written in this way.

## Conclusion

By looking through our components and finding standalone functions that we can pull out, we've greatly simplified our component whilst increasing our test coverage and clarity of our application greatly. I highly encourage you to think twice about adding arbitrary methods onto React components; it's too easy to refer to `this.props.X`.

By pulling the functions into their own modules you are forced to consider which props are needed and how your function will work. It makes code clearer,  it's easier to see which props are used where and it means as your business logic gets more complex you can test it without having to get your UI components involved.

If you'd like to play with the code yourself, [it's all on GitHub](https://github.com/javascript-playground/react-refactoring-with-tests). Feel free to raise an issue if you have any questions.

