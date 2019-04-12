---
layout: post
title: "The perfect unit test"
intro: Today we're talking about how to write the perfect unit test and how to ensure your tests stay readable, usable and maintainable.
---

There's a common theme I find with people who tell me that they don't find unit
testing useful, and it's normally that they are writing bad tests. This is
completely understandable, particularly if you're newer to unit testing. It's
_hard_ to write good tests and it takes practice to get there. All the things
we're going to talk about today were learned the hard way; the pain of bad unit
tests lead me to creating my own rules for how to write a good unit test. It's
these rules that we're going to talk about today.

## Why are bad tests so bad?

When you have application code that is messy, it's hard to work with. But
hopefully you have some tests alongside it, and those help you. It's OK to work
with hard code if you've got tests backing you up. That confidence tests give
you can go along way to erasing the effect of bad code.

Bad tests don't have any code to help you work with them. You don't write tests
for your tests. You _could_, but then you'd have to write tests for your tests
for your tests and that's a spiral none of us want to go down...

## Characteristics of bad tests

It's hard to define a set of traits that make a bad test, because a bad test is
really any test that doesn't follow the rules we're about to talk about.

If you've ever looked at a test and had no idea what it's testing, or you can't
obviously spot the assertion, that's a bad test. A test with a poorly written
description (`it('works')` is a personal favourite) is a bad test.

Tests are bad if _you don't find them useful_. The _entire point_ of having
tests is to increase your productivity, workflow and confidence in your
codebase. If a test isn't doing that (or actively making it worse), it's a bad
test.

I firmly believe that bad tests _are worse_ than no tests.

## A good test starts with a good name

The good news is that the rules of a good test are easy to remember and very
intuitive once you've got used to them!

A good test has a _succinct, descriptive name_. If you can't come up with a
short name, prefer clarity over saving on line length.

```js
it('filters products based on the query-string filters', () => {})
```

You should be able to know just from the description what a test's purpose is
for. You'll sometimes see people name `it` tests based on the method it tests
instead:

```js
it('#filterProductsByQueryString', () => {})
```

But this doesn't help - imagine being new to this code and trying to figure out
exactly what the function does. In this case the name is pretty descriptive, but
an actual human readable string is always better if you can come up with one.

Another guide line for naming tests is to ensure you can read the sentence with
the `it` at the beginning. So if I'm reading the test below, in my head I read
one big sentence:

> "it filters products based on the query-string filters"

```js
it('filters products based on the query-string filters', () => {})
```

Tests that don't do this, even if the string is descriptive, feel clunky:

```js
it('the query-string is used to filter products', () => {})
```

## The three parts of a good test

Once you've got your test named well it's time to focus on the body. A good test
follows the same pattern every single time:

```js
it('filters products based on the query-string filters', () => {
  // STEP ONE: SETUP
  // STEP TWO: INVOKE CODE
  // STEP THREE: ASSERT
})
```

Let's go through each of those steps in turn.

## Setup

The first stage of any unit test is the setup: this is where you get your test
data in order, or mock any functions that you might need to for this test to
run.

```js
it('filters products based on the query-string filters', () => {
  // STEP ONE: SETUP
  const queryString = '?brand=Nike&size=M'

  const products = [
    { brand: 'Nike', size: 'L', type: 'sweater' },
    { brand: 'Adidas', size: 'M', type: 'tracksuit' },
    { brand: 'Nike', size: 'M', type: 't-shirt' },
  ]

  // STEP TWO: INVOKE CODE
  // STEP THREE: ASSERT
})
```

The set up should establish _everything you need_ to perform the test. In this
case I'm creating the query string and the list of products that I'm going to
use to test against. Notice my choice of data for the products too: I've got
items that deliberately don't match the query string, along with one that does.
If I only had products that matched the query string, this test wouldn't prove
that the filtering works.

## Invoke code

This step is normally the shortest: you should call the function that you need
to test. Your test data will have been created by the first step, so you should
just be passing variables into a function at this point.

```js
it('filters products based on the query-string filters', () => {
  // STEP ONE: SETUP
  const queryString = '?brand=Nike&size=M'

  const products = [
    { brand: 'Nike', size: 'L', type: 'sweater' },
    { brand: 'Adidas', size: 'M', type: 'tracksuit' },
    { brand: 'Nike', size: 'M', type: 't-shirt' },
  ]

  // STEP TWO: INVOKE CODE
  const result = filterProductsByQueryString(products, queryString)

  // STEP THREE: ASSERT
})
```

> If the test data is very short, I might merge step one and two, but most of
> the time I find the value in splitting the steps out very explicitly to be
> worth the extra lines it takes up.

## Assert

This is the best step! It's where all your hard work pays off and we check that
what we're expecting to happen actually did.

I call this the assert step as we're making assertions, but these days I tend to
use Jest and it's `expect` function, so you could call this the "Expectation
Step" too if you wanted.

```js
it('filters products based on the query-string filters', () => {
  // STEP ONE: SETUP
  const queryString = '?brand=Nike&size=M'

  const products = [
    { brand: 'Nike', size: 'L', type: 'sweater' },
    { brand: 'Adidas', size: 'M', type: 'tracksuit' },
    { brand: 'Nike', size: 'M', type: 't-shirt' },
  ]

  // STEP TWO: INVOKE CODE
  const result = filterProductsByQueryString(products, queryString)

  // STEP THREE: ASSERT
  expect(result).toEqual([{ brand: 'Nike', size: 'M', type: 't-shirt' }])
})
```

And with that, we have a perfect unit test:

1. It has a descriptive name that reads clearly and is succinct.
2. It has a clear setup phase where we construct test data.
3. The invoking step is limited to simply calling our function with our test
   data.
4. Our assertion is clear and demonstrates the behaviour we're testing clearly.

## Small improvements

Whilst I wouldn't actually include the `// STEP ONE: SETUP` comments in my real
tests, I do find it useful to put a blank line between all three parts. So if
this test was in my codebase for real, it would look like this:

```js
it('filters products based on the query-string filters', () => {
  const queryString = '?brand=Nike&size=M'
  const products = [
    { brand: 'Nike', size: 'L', type: 'sweater' },
    { brand: 'Adidas', size: 'M', type: 'tracksuit' },
    { brand: 'Nike', size: 'M', type: 't-shirt' },
  ]

  const result = filterProductsByQueryString(products, queryString)

  expect(result).toEqual([{ brand: 'Nike', size: 'M', type: 't-shirt' }])
})
```

If we're building a system that has products in it, I'd look to create an easier
way to create these products. I created the
[test-data-bot](https://github.com/jackfranklin/test-data-bot) library to do
exactly this. I won't dive into how it works, but it lets you easily create
_factories_ to create test data. If we had that setup (the `README` has full
instructions) we could have this test like so:

```js
it('filters products based on the query-string filters', () => {
  const queryString = '?brand=Nike&size=M'
  const productThatMatches = productFactory({ brand: 'Nike', size: 'M' })

  const products = [
    productFactory({ brand: 'Nike', size: 'L' }),
    productFactory({ brand: 'Adidas', size: 'M' }),
    productThatMatches,
  ]

  const result = filterProductsByQueryString(products, queryString)

  expect(result).toEqual([productThatMatches])
})
```

By doing this we remove all the details of products that are irrelevant to this
test (notice how the `type` field is not present in our test now) and lets us
easily keep our test data in sync with the real data by updating our factory.

I also pull the product that I want to match out into its own constant so we can
reuse it in the assertion step. This avoids duplication and makes the test
clearer - having a piece of test data titled `productThatMatches` is a strong
hint that it's what we're expecting our function to return.

## Conclusion

If you have these rules in mind whilst writing unit tests I'm confident that
you'll find your tests easier to work with and more useful in your development
workflow. Testing is just like anything else: it takes time and practice.
Remember the three steps: `setup`, `invoke`, `assert` and you'll be writing
perfect unit tests before you know it 👌.
