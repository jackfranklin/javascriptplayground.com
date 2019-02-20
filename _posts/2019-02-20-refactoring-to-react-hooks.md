---
layout: post
title: "Refactoring a component to use React hooks"
intro: To start getting familiar with React hooks, I decided to refactor a component from setState to hooks and see how it went.
githubPath: 2019-02-20-refactoring-to-react-hooks
---

[React 16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) introduced
[hooks](https://reactjs.org/docs/hooks-intro.html); a new way to work with
effects and state in React. No longer do React components that have state need
to be ES2015 classes that extend `React.Component` - hooks let us write
components as functions and still have all the functionality of class based
components.

> It's important to note that React will continue to support class based
> components for a long time yet. It's advised that you consider hooks going
> forward, but there's no need to instigate a big migration of your code.

I wanted to get familiar with hooks and try them on some real life code, and
this blog post is the result of doing that and writing down how I find it, and
comparing the before and after code. This is far from a deep dive into hooks,
but more a quick look at my first experience refactoring to use them. I hope you
find it useful!

> Although I've simplified the code for this example, I did really do this at
> work first on a real component that we shipped!

## The component we are working with.

The component we're going to refactor takes an `id` as a prop, and makes a
request to an API to fetch data for the user with that given ID. Its `id` prop
can change at any time, so we also have to fetch the user data again if the ID
changes. Therefore we have `componentDidMount` and `componentDidUpdate` to deal
with the first render and any subsequent prop changes. The `render` for this
example just dumps the user data out, but in real life this would render a
meaningful UI.

```jsx
import React, { Component } from 'react'

export default class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: undefined,
    }
  }

  componentDidMount() {
    fetchUser(this.props.id).then(user => this.setState({ user }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      fetchUser(this.props.id).then(user => this.setState({ user }))
    }
  }

  render() {
    return (
      <pre>
        <code>{JSON.stringify(this.state.user, null, 4)}</code>
      </pre>
    )
  }
}
```

> Don't worry about the definition of `fetchUser` - it's a small wrapper around
> `fetch` that talks to our API.

## Refactoring to hooks

Let's start thinking about how we will refactor this to use hooks. There are two
hooks we're going to use:

* [`useState`](https://reactjs.org/docs/hooks-state.html), which lets us hold a
  piece of state in our component. We'll use this to hold the `user` data that
  we fetch from our API.
* [`useEffect`](https://reactjs.org/docs/hooks-effect.html). This lets us run
  _side effects_ in our components. That is, things that happen as a result of a
  React component being rendered. You can map this roughly onto the old React
  lifecycle methods - in fact the documentation says just that:
  > If you’re familiar with React class lifecycle methods, you can think of
  > useEffect Hook as componentDidMount, componentDidUpdate, and
  > componentWillUnmount combined.

Because we're using hooks, we will also rewrite our component as a function. So
we can start with our shell:

```jsx
import React, { useState, useEffect } from 'react'

const DemoWithHooks = props => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // TODO
  })

  return (
    <pre>
      <code>{JSON.stringify(user, null, 4)}</code>
    </pre>
  )
}
```

When we call `useState` we get back an array with two items in. The first is the
actual value of the state, and the second is a function used to update that
value. You can call these whatever you'd like, although the `user` and `setUser`
style is becoming convention. We're using
[ES2015 destructuring](/es6-destructuring/) to keep the boilerplate down, but
you could write it as:

```jsx
const userState = useState(undefined)
const user = userState[0]
const setUser = userState[1]
```

The value passed to `useState` is the original value. This is needed for the
first render. Here I've explicitly passed in `undefined` so it's clear that when
this component runs we don't have a user yet. To get a user, we need to move on
to the `useEffect` hook.

## `useEffect`

`useEffect` takes a function and runs it when the component renders. This means
it will run both when the component first mounts, _and_ when the component is
re-rendered. Don't worry though, we are able to have control over exactly when
it is executed, and we'll see that shortly.

Let's fill our `useEffect` call in with a function that fetches our user and
updates the state. Note that we call `setUser` from within `useEffect`. This is
common if you've got some state that you're setting by making an HTTP request.

```jsx
useEffect(() => {
  fetchUser(props.id).then(setUser)
})
```

When used in this manner, the function given to `useEffect` will be called:

* when the component first renders
* anytime the component is subsequently rendered

As it happens, for our component this is OK, because we only have one prop that
could cause an update - `id`. And every time that property changes, we do want
to fetch the user's data again.

But, what if this component took many props, or had other bits of state? In that
case, whenever any of those props changed, and the component was rendered again,
our `fetchUser` code would run. It would do this even if `props.id` hadn't
changed, and that's just a wasted network request if we already have the data
for that user.

In a class based component we would tackle this by adding a conditional to our
`componentDidUpdate` code:

```jsx
componentDidUpdate(prevProps) {
  if (this.props.id !== prevProps.id) {
    fetchUser(this.props.id).then(user => this.setState({ user }))
  }
}
```

This ensures we only make the network request when the data we care about has
changed. We can do the same with `useEffect` by passing a second argument which
is an array of data that has to change for the effect to rerun:

```jsx
useEffect(
  () => {
    fetchUser(props.id).then(setUser)
  },
  [props.id]
)
```

Now our effect will run on first render, and also whenever `props.id` changes.
If any other data changes, it won't trigger the effect.

## The final component

```jsx
const DemoWithHooks = props => {
  const [user, setUser] = useState(undefined)

  useEffect(
    () => {
      fetchUser(props.id).then(setUser)
    },
    [props.id]
  )

  return (
    <pre>
      <code>{JSON.stringify(user, null, 4)}</code>
    </pre>
  )
}
```

If you compare the code above to the starting component at the top of the post,
I think it's much cleaner. The first component has some near-duplicated code in
the `componentDidMount` and `componentDidUpdate`, which is entirely removed as
`useEffect` lets us express everything in one function. We also avoid the
awkward comparison of props in `componentDidUpdate`; something that's easy to
get subtly wrong, especially in complex components, and cause bugs or pointless
network requests. `useEffect` lets us define the effect and what should cause it
to rerun really concisely.

If you're using hooks, I also recommend the
[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
package, which will give you handy linter errors or warnings for some common
mistakes when using hooks. I've been finding it particularly useful for catching
things I get slightly wrong as I adjust to using hooks over class based
components.

If you're not sure where to start with hooks in your codebase, I'd really
recommend this approach of picking one straightforward component and refactoring
it. It's low risk, and a component with just one or two pieces of local state
shouldn't take long to refactor. It's a great learning exercise and a good way
of sharing knowledge of hooks across your team.
