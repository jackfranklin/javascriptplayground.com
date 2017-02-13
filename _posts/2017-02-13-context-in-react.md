---
layout: post
title: Context in React
intro: Today we'll dive into context in ReactJS, a feature that's often misunderstood and not used correctly by developers.
githubPath: 2017-02-13-context-in-react
---

There is a lot of confusion amongst React developers on what context is, and why it exists. It's also a feature that's been hidden in the React documentation in the past and, [although it is now documented on the React site](https://facebook.github.io/react/docs/context.html) I thought a post on its usage and when to use it would be of use.

The short answer is that you should __very rarely, if ever__ use context in your own React components. However, if you're writing a library of components, it can come in useful, and we'll discuss why this is later.

## What is context in React, and how does it work?

In React the primary mechanism for communication between your components is through properties, or `props`, for short. Parent components can pass properties down to their children:

```js
const SomeParentComponent = () => {
  const foo = 2
  return (
    <SomeChildComponent foo={foo} />
  )
}
```

Here, the parent component `SomeParentComponent` passes the prop `foo` through to its child, `SomeChildComponent`.

> Here, a _child component_ is a component that another component renders. A _parent component_ is a component that directly renders another.

If a child component wants to communicate back to its parent, it can do so through props, most commonly by its parent providing a _callback property_ that the child can call when some event happens:

```js
const SomeParentComponent = () => {
  const letMeKnowAboutSomeThing = () => console.log('something happened!')

  return (
    <SomeChildComponent letMeKnowAboutSomeThing={letMeKnowAboutSomeThing} />
  )
}

const SomeChildComponent = props => {
  const onClick = e => {
    e.preventDefault()
    props.letMeKnowAboutSomeThing()
  }

  return <a onClick={onClick}>Click me!</a>
}
```

The key thing about this communication is that it's _explicit_. Looking at the code above, you know how the components are communicating, where the `letMeKnowAboutSomeThing` function comes from, who calls it, and which two components are in communication. [You can see this in action on CodePen](http://codepen.io/jackfranklin/pen/vgvYOa?editors=0011).

This property of React, its explicitness of data passing between components, is one of its best features. React is very explicit as a rule, and this is in my experience leads to clearer code that's much easier to maintain and debug when something goes wrong. You simply have to follow the path of props to find the problem.

As you might have guessed, context is a way to break this explictness. When a component defines some data onto its _context_, any of its descendants can access that data. That means any child further down in the component tree can access data from it, without being passed it as a property. Let's take a look at context in action.

First, on the _parent component_, we define two things:

1. A function, `getChildContext`, which defines what context is exposed to its descendants.
2. A static property, `childContextTypes`, which defines the types of the objects that `getChildContext` returns.

For a component to provide context to its descendants, it must define both of the above. Here, `SomeParentComponent` exposes the property `foo` on its context:

```js
class SomeParentComponent extends React.Component {
  getChildContext() {
    return { foo: 'bar' }
  }
  
  render() {
    return <SomeChildComponent />
  }
}

SomeParentComponent.childContextTypes = {
  foo: React.PropTypes.string
}
```

`SomeChildComponent` can now gain access to the `foo` property by defining a static property `contextTypes`:

```js
const SomeChildComponent = (props, context) => {
  return <p>The value of foo is: { context.foo }</p>
}
SomeChildComponent.contextTypes = {
  foo: React.PropTypes.string
}
```

> In a functional, stateless component, `context` is accessed via the second argument to the function. In a standard class component, it's available as `this.context`.

What's important here though is that any component that `SomeChildComponent` renders, or any component its children render, and so on, are able to access the same context just by defining `contextTypes`.

## Why you should avoid context

There's a few reasons why you would want to avoid using context in your own code.


#### 1. Hard to find the source.

Imagine that you're working on a component on a large application that has hundreds of components. There's a bug in one of them, so you go hunting and you find some component that uses context, and the value it's outputting is wrong.

```js
const SomeAppComponent = (props, context) => (
  <div>
    <p>Hey user, the current value of something is { context.value }</p>
    <a onClick={context.onSomeClick()}>Click here to change it.</a>
  </div>
)

SomeAppComponent.contextTypes = {
  value: React.PropTypes.number.isRequired,
  onSomeClick: React.PropTypes.func.isRequired,
}
```

The bug is related to the click event not updating the right value, so you now go looking for the definition of that function. If it was being passed as a property, you could go immediately to the place where this component is rendered (which is usually just a case of searching for its name), and start debugging. In the case that you're using context, you have to search for the function name and hope that you find it. This could be found easily, granted, but it also could be a good few components up the chain, and as your apps get larger the chances of you finding the source quickly gets smaller.

It's similar to the problem when you work in an object oriented language and inherit from classes. The more classes you inherit from (or in React, the further down the component tree you get), it's harder to find the source for a particular function that's been inherited.

#### 2. Binds components to a specific parent

A component that expects only properties (or no properties at all) can be used anywhere. It is entirely reusable and a component wanting to render it need only pass in the properties that it expects. If you need to use the component elsewhere in your application you can do easily;  just  by supplying the right properties.

However, if you have a component that needs specific context, you couple it to having to be rendered by a parent that supplies some context. It's then harder to pick up and move, because you have to move the original component and then make sure that its new parent (or one of its parents) provides the context required.

#### 3. Harder to test

Related to the previous point, components that need context are much harder to test. Here's a test, using [Enzyme](http://airbnb.io/enzyme/), that tests a component that expects a `foo` prop:

```js
const wrapper = mount(<SomeComponent foo='bar' />)
```

And here's that same test when we need `SomeComponent` to have a specific piece of context:

```js
class ParentWithContext extends React.Component {
  getChildContext() {...}

  render() {
    return <SomeComponent />
  }
}
ParentWithContext.childContextTypes = {...}

const wrapper = mount(<ParentWithContext />)
```

It's harder here because we have to build the right parent component - it's messier and quite verbose just to set up the component in the right context for testing.

> You can actually use Enzyme's [setContext](http://airbnb.io/enzyme/docs/api/ReactWrapper/setContext.html) to set context for these tests - but I tend to try to avoid any methods like this that breaks the React abstraction. You also wouldn't be able to do this so easily in other testing frameworks.

#### 4. Unclear semantics around context value changes and rerenders.

With properties and state, it's very clear to React when it should rerender a component:

1. When a component's properties change.
2. When `this.setState` is called.

The `getChildContext` function is called whenever state or properties change, so in theory you can rely on components that use `context` values reliably updating. The problem though is `shouldComponentUpdate`. Any component can define `shouldComponentUpdate`, making it return `false` if it knows that it doesn't need to be re-rendered. If an interim component does this, a child component won't update, even if a context value changes:

```
TopLevelComponent
- defines context.foo

    MidLevelComponent
    - defines `shouldComponentUpdate` to return `false`

        ChildComponent
        - renders `context.foo` into the DOM

```

In the above example, if `context.foo` changes, `ChildComponent` will not render, because its parent returned `false` from `shouldComponentUpdate`. This makes bugs possible and leaves us with no reliable way to update context and ensure renders, so this is a very good reason to avoid using `context`.

## When to use context

## Conclusion






