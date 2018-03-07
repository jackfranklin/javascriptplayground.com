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
or props. If you're having to store a huge amount of data on a component, or
take 10 props to ensure it can be configured correctly, then maybe you should
instead have more components that take fewer props.

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
viewUser(userId) {
  this.setState({ activeUser: this.state.users[userId] })
}
```

And the relevant logic in the `render` function:

```js
render() {
  return (
    <div>
      { this.renderUsers() }
      { this.state.activeUser && <div>output user things here</div>}
    </div>
  )
}
```

This component is now doing a lot of work! Imagine having to write tests for
this component, you'd have to mock out the HTTP call, test that it handles with
success and error cases, check that it lists the right users, and test that it
can show a user when you click on them. That's a lot to test. Instead, let's
imagine we had a suite of components that we could compose together.

The first component, named something like `UsersContainer`, could be responsible
for fetching the users and then passing them down into `UserList`, which in turn
could render a `User` component.

By doing this you end up with a tree of components, where each one has one job
and then passes the rest of the work down to the child:

* `UsersContainer`: fetch data, show loading spinner / errors, pass data down
* `UserList`: lists the users, delegating the rendering to `User`. Keeps track
  of the active user.
* `User` can render an individual user and deal with UI interactions.

### 2. Delegates data processing to an external module

As a general rule I like to keep my React components as succinct as they can be,
and one of the best ways of doing that is to pull logic out into external
modules. Taking the list of users example from above, imagine the component had
to make the request and then process the data:

```js
componentDidMount() {
  this.fetchUsers().then(users => this.processUsersFromApi(users))
}

processUsersFromApi(users) {
  // some data processing here
}

render() {
  // render some things!
}
```

To test this code we have to always go through the component. It's also harder
if we want to reuse this processing logic (you could imagine more than one place
in our code having to process data from our users API), and makes the React
component contain a substantial amount of code that isn't specific to UI.

Instead, we're much better off extracting that code into a separate module:

```js
import processUsersFromApi from './process-users-from-api'

componentDidMount() {
  this.fetchUsers().then(processUsersFromApi)
}

render() {
  // render some things!
}
```

And now the component is shorter and contains much less logic that we have to
understand to work on it. Another advantage is that we can test our business
logic in isolation now without having to mount React components in test to do
so.

### 3. Uses PropTypes consistently (or TypeScript/Flow)

It's tempting when you're writing a component to not use PropTypes. They involve
extra effort both to write initially, and then to maintain as you develop your
component. However, they offer a lot of value to people who use your component,
and other people on your team who have to maintain the code. You'll thank
yourself if you come back to a component in six months and have to figure out
how to use it!

Documenting the prop types also means a typo is spotted much quicker than it
would be otherwise:

```js
const UserComponent = () => {}
UserComponent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
}

// later...

class App extends Component {
  render() {
    // causes error about missing prop isAuthenticated in console
    return (
      <div>
        <UserComponent isAuthenticatd={true} />
      </div>
    )
  }
}
```

### 4. Has a concise `render` method

A good sign that a component is taking on too much responsibility is if its
render method becomes hard to understand. A component should ideally render a
small amount of DOM, or delegate parts of its rendering to other components.

For example, let's take a component that shows a user form. It shows a few text
fields (to keep the example a bit shorter I've omitted some of the fields) and a
search button. The search button's outputs and classes depend on if we've
submitted the form or not, and we make use of the excellent
[classnames](https://github.com/JedWatson/classnames) package to conditionally
set classes.

```js
class App extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={this.state.input}
              placeholder="Enter your name"
              onChange={this.onChange}
            />
          </label>
          {/* imagine a few more text fields, labels, and so on...*/}
          <button
            type="submit"
            className={classNames('btn', 'btn-primary', {
              loading: this.state.loading,
              disabled: this.state.input === '',
            })}
          >
            {this.state.loading ? 'Loading...' : 'Go'}
          </button>
        </form>
      </div>
    )
  }
}
```

Already, even in this example, this component takes some effort to understand.
And this is with some of the code omitted to avoid this blog post being too
long! React and JSX is very expressive and on the whole easy to follow, but once
your render method has some extra functionality or conditionals, they can
occasionally become hard to follow.

As a first pass you could pull out another render function to just handle the
button:

```js
class App extends Component {
  renderSubmit() {
    return (
      <button
        type="submit"
        className={classNames('btn', 'btn-primary', {
          loading: this.state.loading,
          disabled: this.state.input === '',
        })}
      >
        {this.state.loading ? 'Loading...' : 'Go'}
      </button>
    )
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={this.state.input}
              placeholder="Enter your name"
              onChange={this.onChange}
            />
          </label>
          {/* imagine a few more text fields, labels, and so on...*/}
          {this.renderSubmit()}
        </form>
      </div>
    )
  }
}
```

This works, and is a valid step to take, but now whilst the `render` method is
smaller, all you've done is move some of it into another function. There are
times where this is enough to add clarity, but one confusing aspect is that it's
harder to see what props and/or state the submit button uses. So to make that
clearer we could pass them in as arguments:

```js
class App extends Component {
  renderSubmit(loading, inputValue) {
    return (
      <button
        type="submit"
        className={classNames('btn', 'btn-primary', {
          loading: loading,
          disabled: inputValue === '',
        })}
      >
        {loading ? 'Loading...' : 'Go'}
      </button>
    )
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={this.state.input}
              placeholder="Enter your name"
              onChange={this.onChange}
            />
          </label>
          {/* imagine a few more text fields, labels, and so on...*/}
          {this.renderSubmit(this.state.loading, this.state.input)}
        </form>
      </div>
    )
  }
}
```

This is certainly nicer because it's explicit about the values the submit button
needs, but there's nothing to stop a developer by-passing this mechanism and
just referring to `this.props` or `this.state` directly.

The final, best step, is to instead embrace React to the fullest and extract a
submit button component.

```js
class App extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={this.state.input}
              placeholder="Enter your name"
              onChange={this.onChange}
            />
          </label>
          <Button
            loading={this.state.loading}
            disabled={this.state.input === ''}
          />
        </form>
      </div>
    )
  }
}
```

Now we have a smaller component and we've ended up with a reusable button
component that should be save us time the next time we build out a form.

### 5. Does not store state that can be calculated from `props`

One common mistake that beginners make with React is to set far too many
attributes onto the state and spend a lot of effort keeping them in sync. A good
hint that you're doing this is that you find yourself continuously having to use
[`componentWillReceiveProps`](https://reactjs.org/docs/react-component.html#componentwillreceiveprops)
to react to property changes and update your state. To be clear: there are times
when you will need to use this method, but on the whole you should be trying to
avoid it.

If you need to do some async work (such as making HTTP requests) when the
component does update, you should use
[`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentdidupdate).

There are a couple of rules I try to follow that help to avoid these issues:

* If a piece of data can be computed purely from properties, it should not be
  kept in state.
* Any data that a component has as its state should be data that _the component
  itself changes_. A hint that you might not have quite the right state is if
  you find yourself referring to `this.state.userName` without ever having a
  `this.setState` call within a component.

For the first case, a good example here is a component that takes `firstName`
and `lastName` properties:

```js
<UserProfileLink firstName="Jack" lastName="Franklin" />
```

Inside this component we might decide to store a `fullName`:

```js
class UserProfileLink extends Component {
  constructor(props) {
    super(props)

    this.state = { fullName: this.props.firstName + this.props.lastName }
  }
}
```

Now in our render method we can refer to `this.state.fullName` to show the
user's full name, and we now have state that is never changed within our
component, and we'll have to use `componentWillReceiveProps` to keep it in sync.

Keeping data in sync is hard; and it's a problem that the framework should solve
for you. Rather than trying to manually do this work, we can instead just
compute the `fullName` in our `render` call:

```js
class UserProfileLink extends Component {
  render() {
    const fullName = `${this.props.firstName} ${this.props.lastName}`

    return <div>{fullName}</div>
  }
}
```

If the computation is more expensive, and you want to ensure you're not
regenerating the value even if the properties that make it up haven't changed,
you could look into a technique called "memoization". This
[old but still excellent blog post](https://addyosmani.com/blog/faster-javascript-memoization/)
by Addy Osmani is a good introduction into it. There are plenty of libraries
available to you too on npm that will help with this.

### 6. Has consistently named event handlers

A short point, but one that I've fallen foul to many times! It's very easy to
pick names for event handling methods in your React component with no real
convention and on a smaller component or app that would not be an issue, but on
larger apps you'll thank yourself for coming up with a convention that makes
things easier.

I've taken to prefixing all my event handling methods with `on`, so that it's
clear when looking through a component which methods are event handlers. It also
means you can search a file for `on` and find the methods fairly easily.

This is a small point but one that will add up each time you use it in a
component that you're working on. Having a variety of event handler names (I've
written components that use `onUserClick` and `userSubmittedForm`, for example)
makes it harder to work on the code. The exact convention doesn't matter, but
having one will definitely improve your component's maintainability.

### 7. Uses class properties for event handlers

With the [class fields proposal](https://github.com/tc39/proposal-class-fields)
now at Stage 3 of the ECMA process (meaning it's very likely to end up as part
of JavaScript) and there being a
[babel plugin available for this proposal](https://babeljs.io/docs/plugins/transform-class-properties/),
it's become very common in the React community to define event handlers as arrow
functions. This helps differentiate them from regular methods (which compliments
Point 6 nicely) and ensures that they are bound correctly, so you don't have to
explicitly call `.bind(this)` to ensure that they are called with the right
scope.

Coupled with a solid naming convention, this makes event handlers very easy to
distinguish:

```js
onUserSubmitForm = event => {
  event.preventDefault()
  // do things
}

otherNonEventMethod() {
  // do other things
}
```

It's worth noting that there
[are some issues with arrow functions that it's worth being aware of](https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1),
but in my opinion they present the best option available to us now. If and when
the [Decorator Proposal](https://tc39.github.io/proposal-decorators/) makes it
into the language, we may end up being able to use a decorator on event handlers
to bind them to the right scope, but until then arrow functions are a good
alternative.

### Conclusion

By no means an exhaustive list; these are seven traits that I think represent
React components that tend to be more reliable, more maintainable, more testable
and more fun to work on. I'd love to know if you have any to add to this list,
or if you have any that you do differently. The great thing about React is that
it gives you a lot of alternative approaches, so it's always great to see how
others are doing it.
