---
layout: post
title: Using React Fragments for the first time
intro: Today we'll look at a new feature introduced in React 16, fragments
githubPath: 2017-12-18-react-fragments
---

React v16 was a very exciting release for React, and included many new features. In the recent [React 16.2 release](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html), improved support for Fragments was announced, and it's this feature that I want to talk about today.

## The problem that fragments solve

Up until React 16 each component had to return a single element:

```js
// will error
class Demo extends Component {
  render() {
    return <p>foo</p><p>bar</p>
  }
}
```

```js
// OK!
class Demo extends Component {
  render() {
    return (
      <div>
        <p>foo</p>
        <p>bar</p>
      </div>
    )
  }
}
```

With the release of React 16, you were able to return an array of elements that a component would render:

```js
// allowed in React 16
// but you'll get a warning about keys
class Demo extends Component {
  render() {
    return [<p>foo</p>, <p>bar</p>]
  }
}
```

This is OK; but it has two problems:

1. It breaks the JSX abstraction; it's odd to now have a component returning an array containing JSX elements. Whenever I do this I always forget the commas after each array item because I'm not used to using them in JSX.
2. You have to add a `key` property to each element to avoid React warnings, which can make the `render` function verbose and less easy to follow.

Because returning arrays didn't feel that natural in React 16, it was far more common to eschew them in favour of wrapping elements in one containing element; most normally a `div` or a `span`.

On a large application with a suite of components this can very quickly lead to a set of wrapping elements that can produce a big set of HTML soup. Fragments solve this problem.

## Fragments in React 16.2

React 16.2 introduced the `Fragment`:

> Fragments look like empty JSX tags. They let you group a list of children without adding extra nodes to the DOM:

-- [React 16.2 release](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html)

The `Fragment` element is imported from the `react` module, and can be used just like any other JSX element. The difference is that a `Fragment` component doesn't end up adding any extra markup into the DOM:

## Using a Fragment

First, we import `Fragment` just like we import `Component` from `react`:

```js
import React, { Fragment } from 'react'
```

And then we use it just like any other React component:

```js
const App = () => (
  <Fragment>
    <p>foo</p>
    <p>bar</p>
  </Fragment>
)
```

The key here is that the resulting DOM from the `App` component will look like so:

```html
<p>foo</p>
<p>bar</p>
```

## A special fragment syntax

React 16.2 also introduced a syntactical sugar for `Fragment`s. For example, the code below creates the exact same result as the `App` component above:

```js
const App = () => (
  <>
    <p>foo</p>
    <p>bar</p>
  </>
)
```

I'm not sure if I'll use this syntax over the more explicit `Fragment` syntax; but I think this comes down to personal preference.

It's worth noting that if you need to pass a `Fragment` any props (most likely a `key` prop if you're iterating over a list), you can't use this special syntax; if you have to pass props you need to use `Fragment`.

## A use case for fragments

At [Thread](thread.com) we're building a site for finding and buying clothing and I was working on a component that allows users to select their size from a dropdown. If the item is out of stock or low on stock, we wanted to show that along side their size. So a dropdown might look like so:

```
- S
- M - Low stock
- L - Out of stock
```

So we're looping over an array of data to generate the `option`s for the `select` dropdown. The data looks like so:

```js
const sizes = [
  { id: 1, size: 'S', stockDisplay: 'In stock', stockLevel: 'IN_STOCK' },
  { id: 2, size: 'M', stockDisplay: 'Low stock', stockLevel: 'LOW_STOCK' },
  {
    id: 3,
    size: 'L',
    stockDisplay: 'Out of stock',
    stockLevel: 'OUT_OF_STOCK',
  },
]
```

Initially the code for this looked like so:

```js
generateOptionForSize = size => (
  <option
    key={size.id}
    value={size.size}
    disabled={size.stockLevel === 'OUT_OF_STOCK'}
  >
    {size.stockLevel === 'IN_STOCK'
      ? size.size
      : `${size.size} - ${size.stockDisplay}`}
  </option>
)
```

This worked fine but I felt like it could be a little cleaner, particularly the conditional for deciding if to show the extra information or not. In addition, I wanted to replace the hyphen with an [`mdash`](http://www.html.am/html-codes/character-codes/html-em-dash-code.cfm), and because I was returning the contents of the `option` as a string, that was hard to do. If I did:

```js
{
  size.stockLevel === 'IN_STOCK'
    ? size.size
    : `${size.size} &mdash; ${size.stockDisplay}`
}
```

React would sanitise the string and output the literal `&mdash;` text into the page.

However, swapping out the string interpolation using ES2015 template strings for a React `Fragment` suddenly made the entire code easier to follow, and allowed me to use an HTML entity:

```js
generateOptionForSize = size => (
  <option
    key={size.id}
    value={size.size}
    disabled={size.stockLevel === 'OUT_OF_STOCK'}
  >
    {size.stockLevel === 'IN_STOCK' ? (
      size.size
    ) : (
      <Fragment>
        {size.size} &mdash; {size.stockDisplay}
      </Fragment>
    )}
  </option>
)
```

This is now easier to follow and allows me to use HTML entities and have them work as expected.

## Conclusion

I can already see many more places through our app which could be made more straightforward and easier to work with as a result of `Fragment`s and I'm excited to continue using them. Not only do they clear up a lot of component code, but the fact that they have no output into the DOM should lead to fewer superfluous `div` and `span` elements that a lot of React applications are littered with.
