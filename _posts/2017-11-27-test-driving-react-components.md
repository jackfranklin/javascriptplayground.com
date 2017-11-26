---
layout: post
title: Test driving React components
intro: In today's post I'll look at how it's possible to build React components following the test driven development methodology, where tests are written first.
githubPath: 2017-11-27-test-driving-react-components
---

In today's post I'm going to look further into how you might build React components by following a test driven development (TDD) approach. That is, we'll write the tests first, watch them fail, and then build the React component out to fix the tests, before then writing more. We'll then consider how we can refactor code and pull logic out of components into plain old JavaScript objects (POJOs).

> In reality, I don't often write components from scratch in a TDD way, however I will often use TDD to replicate an existing bug in a component to first see the bug in action, and then fixing it. Feedback via test results on the command line is often much quicker than browser refreshes and manual interactions, so writing tests can be a very productive way to improve or fix a component's behaviour.

## Set up

I'll be using a brand new React app for this tutorial, which I've created with [create-react-app](https://github.com/facebookincubator/create-react-app). This comes complete with [Jest](https://facebook.github.io/jest/), a test runner built and maintained by Facebook.

There's one more dependency we'll need for now - [Enzyme](https://github.com/airbnb/enzyme). Enzyme is a suite of test utilities for testing React that makes it incredibly easy to render, search and make assertions on your components, and we'll use it extensively today. Enzyme also needs `react-test-renderer` to be installed (it doesn't have it as an explicit dependency because it only needs it for apps using React 15.5 or above, which we are), so install that too:

```
yarn add -D enzyme react-test-renderer
```

> The `-D` argument tells Yarn to save these dependencies as developer dependencies.

## First component

Let's first build a component that takes a `name` prop and renders `<p>Hello, name!</p>` onto the screen. As we're writing tests first, I'll create `src/Hello.test.js`, following the convention for test files that `create-react-app` uses (in your own apps you can use whichever convention you prefer). Here's our first test:


```jsx
import React from 'react'
import Hello from './Hello';
import { shallow } from 'enzyme';

it('renders', () => {
  const wrapper = shallow(<Hello name="Jack" />);
  expect(wrapper.find('p').text()).toEqual('Hello, Jack!');
});
```

We use Enzyme's [shallow rendering API](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md). Shallow rendering will only render one level of components deep (that is, if our `Hello` component rendered the `Foo` component, it would not be rendered). This helps you test in isolation and should be your first point of call for testing React components.

You can run `yarn test` in a React app to run it and have it rerun on changes. If you do that now, you'll see our first error:

```
Cannot find module './Hello' from 'Hello.test.js'
```

So let's at least define the component and give it a shell that renders nothing:

```jsx
import React from 'react';

const Hello = props => {
  return null
}

export default Hello
```

Now we get a slightly cryptic error:

```jsx
Method “text” is only meant to be run on a single node. 0 found instead.
```

Once you've used Enzyme a couple of times this becomes much clearer; this is happening because we're calling `wrapper.find('p')` and then calling `text()` on that to get the text, but the component is not rendering a paragraph. Let's fix that:

```jsx
const Hello = props => {
  return <p>Hello World</p>
}
```

Now we're mucuh closer!

```
expect(received).toEqual(expected)

Expected value to equal:
  "Hello, Jack!"
Received:
  "Hello World"
```

And we can make the final leap to a green test:

```jsx
const Hello = props => {
  return <p>Hello, {props.name}!</p>
}
```

Next up, let's write a test to ensure that if we don't pass in a name, it defaults to "Unknown". At this point I'll also update our first test, because `it('renders', ...)` is not very descriptive. It's good to not care too much about the name of the first test you write, and focus on the implementation, but once you're more comfortable with what you're testing and beginning to expand your test suite, you should make sure you keep things organised.

With our second test, we're failing again:

```jsx
it('renders the name given', () => {...})

it('uses "Unknown" if no name is passed in', () => {
  const wrapper = shallow(<Hello />);
  expect(wrapper.find('p').text()).toEqual('Hello, Unknown!');
});
```

```
expect(received).toEqual(expected)

Expected value to equal:
  "Hello, Unknown!"
Received:
  "Hello, !"
```

But we can now write our first pass at the implementation to fix it:


```jsx
const Hello = props => {
  return <p>Hello, {props.name || 'Unknown'}!</p>
}
```

And now the test is green we're free to refactor. The above is perfectly fine but not the way it's usually done in React. Some might choose to destructure the `props` argument and give `name` a default value:

```jsx
const Hello = ({
  name = 'Unknown'
}) => {
  return <p>Hello, {name}!</p>
}
```

But most of the time when working with React components I'll use the `defaultProps` object to define the defaults. I'll also set the component's `propTypes`:

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const Hello = props => {
  return <p>Hello, {props.name}!</p>
}

Hello.propTypes = {
  name: PropTypes.string,
}

Hello.defaultProps = {
  name: 'Unknown'
}

export default Hello
```

And all our tests are still passing.

## Rendering a Todo

Now let's move on to testing something a little more complex - a `<Todo>` component that can take and render a todo. Let no one say I'm not unique with my code examples!

Once we've done this we'll then look at how we might test a component that renders a list of `<Todo>` components.
