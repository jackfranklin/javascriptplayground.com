---
layout: post
title: Habits of Successful React components
intro: In this post we'll look at some approaches and methods you can apply to your React components to keep them easy to use, test, edit and maintain.
githubPath: 2018-02-20-habits-of-successful-react-components
---

One of the best features of React, and one of the reasons I think so many people
love using it, is that it gives you the freedom to choose what approach you're
going to take. As a primarily view based library, React provides no out-the-box
opinions on how you make HTTP requests, how you style your components, what
naming conventions to use, and so on. It leaves all those decisions up to you.
This is a good thing in my experience; often a set of conventions that worked
well for one of your applications might not work so well for another and having
that flexibility is something I've come to appreciate.

That said, over the last few years of writing React components I've come up with
a set of guidelines that I tend to follow, and in this post I wanted to share
those below. I'd love to hear if you disagree with any of these (all of these
are personal preference) or if you have any more to add to the list.

### 1. Has a single job or responsibility

If you picked one rule out of this list to follow, it would be this one. The
approach I try to take here is to have as many React components as I need and to
never feel like I've got too many. Components are made to be composed together
and as such you should compose them whenever it makes sense to avoid any one
component doing too much.

A good indication of this in action is if a component has a very long `render`
method (see Point 5 for more). That will often hint that it's doing too much
that could be delegated. A similar indicator is a component with a lot of state
or props. If you're having to store a tonne of data on a component, or take 10
props to ensure it can be configured correctly, then maybe you should instead
have more components that take fewer props.

Take for example, a component that fetches users from an API, lists them and
lets you click on them to see the active user. It would have three distinct
functions that would make up the component. Firstly, the HTTP logic in
`componentDidMount` (I've left out error handling for the example but imagine
it's there):

```js
componentDidMount() {
  fetchUsersFromMyApi().then(users => this.setState({ users }))
}
```

You'd then have the code to list these users, either directly in `render` or in
another method that you call from `render`:

```js
renderUsers() {
  return (
    <ul>
      {this.state.users.map(user =>
         <li key={user.id} onClick={() => this.viewUser(user.id)}>{user.name}</li>
      )}
    </ul>
  )
}
```

And then you'd need the logic for setting the active user in the state:

```js
viewUser = userId => this.setState({ activeUser: this.state.users[userId] })
```

And the relevant logic in the `render` function:

```js
render() {
  return (
    <div>
      { this.renderUsers() }
      { this.state.activeUser && <div>...</div>}
    </div>
  )
}
```

This component is now doing a lot of work! Imagine having to write tests for
this component, you'd have to mock out the HTTP call, test that it handles with
success and error cases, check that it lists the right users, and test that it
can show a user when you click on them. That's a lot to test. Instead, let's
imagine we had a suite of components that we could compose together.

### 2. Delegates data processing

foo

### 3. Has scoped CSS styling

### 4. Uses PropTypes consistently (or TypeScript/Flow)

### 5. Has a concise `render` method

### 6. Does not store state that can be calculated from `props`

### 7. Has consistently named event handlers

### 8. Handles errors gracefully

```

```
