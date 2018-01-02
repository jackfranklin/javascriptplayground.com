---
layout: post
title: Context in ReactJS Applications
intro: Today we'll dive into context in ReactJS, a feature that's often misunderstood and not used correctly by developers.
githubPath: 2017-02-13-context-in-reactjs-applications
---

There is a lot of confusion amongst React developers on what context is, and why it exists. It's also a feature that's been hidden in the React documentation in the past and, [although it is now documented on the React site](https://facebook.github.io/react/docs/context.html) I thought a post on its usage and when to use it would be of use.

The short answer is that you should **very rarely, if ever** use context in your own React components. However, if you're writing a library of components, it can come in useful, and we'll discuss why this is later.

## What is context in React, and how does it work?

In React the primary mechanism for communication between your components is through properties, or `props`, for short. Parent components can pass properties down to their children:

```js
const ParentComponent = () => {
  const foo = 2;
  return <ChildComponent foo={foo} />;
};
```

Here, the parent component `ParentComponent` passes the prop `foo` through to its child, `ChildComponent`.

> Here, a _child component_ is a component that another component renders. A _parent component_ is a component that directly renders another.

If a child component wants to communicate back to its parent, it can do so through props, most commonly by its parent providing a _callback property_ that the child can call when some event happens:

```js
const ParentComponent = () => {
  const letMeKnowAboutSomeThing = () => console.log('something happened!');

  return <ChildComponent letMeKnowAboutSomeThing={letMeKnowAboutSomeThing} />;
};

const ChildComponent = props => {
  const onClick = e => {
    e.preventDefault();
    props.letMeKnowAboutSomeThing();
  };

  return <a onClick={onClick}>Click me!</a>;
};
```

The key thing about this communication is that it's _explicit_. Looking at the code above, you know how the components are communicating, where the `letMeKnowAboutSomeThing` function comes from, who calls it, and which two components are in communication. [You can see this in action on CodePen](http://codepen.io/jackfranklin/pen/vgvYOa?editors=0011).

This property of React, its explicitness of data passing between components, is one of its best features. React is very explicit as a rule, and this is in my experience leads to clearer code that's much easier to maintain and debug when something goes wrong. You simply have to follow the path of props to find the problem.

This diagram shows how props keep communication clear but can get a little excessive as you gain many layers in your application; each component has to explictly pass props down to any children.

![](/img/posts/context-in-react/props.png?resize=820,1000&pngquant=16)

One issue you might find in big apps is that you might need to pass props from a top level `ParentComponent` to a deeply nested `ChildComponent`. The components in between will probably have no use the these props and should probably not even know about them. When this situation arises, you can consider using React's context feature.

Context acts like a portal in your application in which components can make data available to other components further down the tree without being passed through explictly as props.

![](/img/posts/context-in-react/context.png?resize=820,1000&pngquant=16)

When a component defines some data onto its _context_, any of its descendants can access that data. That means any child further down in the component tree can access data from it, without being passed it as a property. Let's take a look at context in action.

## How to use `context` in React applications

First, on the _parent component_, we define two things:

1. A function, `getChildContext`, which defines what context is exposed to its descendants.
2. A static property, `childContextTypes`, which defines the types of the objects that `getChildContext` returns.

For a component to provide context to its descendants, it must define both of the above. Here, `ParentComponent` exposes the property `foo` on its context:

```js
class ParentComponent extends React.Component {
  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <ChildComponent />;
  }
}

ParentComponent.childContextTypes = {
  foo: React.PropTypes.string,
};
```

`ChildComponent` can now gain access to the `foo` property by defining a static property `contextTypes`:

```js
const ChildComponent = (props, context) => {
  return <p>The value of foo is: {context.foo}</p>;
};
ChildComponent.contextTypes = {
  foo: React.PropTypes.string,
};
```

> In a functional, stateless component, `context` is accessed via the second argument to the function. In a standard class component, it's available as `this.context`.

What's important here though is that any component that `ChildComponent` renders, or any component its children render, and so on, are able to access the same context just by defining `contextTypes`.

## Why you should avoid context

There's a few reasons why you would want to avoid using context in your own code.

#### 1. Hard to find the source.

Imagine that you're working on a component on a large application that has hundreds of components. There's a bug in one of them, so you go hunting and you find some component that uses context, and the value it's outputting is wrong.

```js
const SomeAppComponent = (props, context) => (
  <div>
    <p>Hey user, the current value of something is {context.value}</p>
    <a onClick={context.onSomeClick()}>Click here to change it.</a>
  </div>
);

SomeAppComponent.contextTypes = {
  value: React.PropTypes.number.isRequired,
  onSomeClick: React.PropTypes.func.isRequired,
};
```

The bug is related to the click event not updating the right value, so you now go looking for the definition of that function. If it was being passed as a property, you could go immediately to the place where this component is rendered (which is usually just a case of searching for its name), and start debugging. In the case that you're using context, you have to search for the function name and hope that you find it. This could be found easily, granted, but it also could be a good few components up the chain, and as your apps get larger the chances of you finding the source quickly gets smaller.

It's similar to the problem when you work in an object oriented language and inherit from classes. The more classes you inherit from (or in React, the further down the component tree you get), it's harder to find the source for a particular function that's been inherited.

#### 2. Binds components to a specific parent

A component that expects only properties (or no properties at all) can be used anywhere. It is entirely reusable and a component wanting to render it need only pass in the properties that it expects. If you need to use the component elsewhere in your application you can do easily; just by supplying the right properties.

However, if you have a component that needs specific context, you couple it to having to be rendered by a parent that supplies some context. It's then harder to pick up and move, because you have to move the original component and then make sure that its new parent (or one of its parents) provides the context required.

#### 3. Harder to test

Related to the previous point, components that need context are much harder to test. Here's a test, using [Enzyme](http://airbnb.io/enzyme/), that tests a component that expects a `foo` prop:

```js
const wrapper = mount(<SomeComponent foo="bar" />);
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

If you're a library author, context is useful. Libraries like [React Router use context](https://github.com/ReactTraining/react-router/blob/v4/packages/react-router/modules/Router.js#L13) to allow the components that they provide application developers to communicate. When you're writing a library that provides components that need to talk to each other, or pass values around, `context` is perfect. Another famous library that makes use of context is [react-redux](https://github.com/reactjs/react-redux/blob/master/src/components/Provider.js#L23). I encourage you to look through the source code for both React Router and React Redux, you can learn a lot about React by doing so.

Let's build our own router library, `RubbishRouter`. It will define two components: `Router` and `Route`. The `Router` component needs to expose a `router` object onto the context, so our `Route` components can pick up on it and use it to function as expected.

`Router` will be used to wrap our entire application, and the user will use multiple `Route` components to define parts of the app that should only render if the URL matches. To do this, each `Route` will take a `path` property, indicating the path that they should match before rendering.

First, `Router`. It exposes the `router` object on the context, and other than that it simply renders the children that it's given:

```js
const { Component, PropTypes } = React;

class Router extends Component {
  getChildContext() {
    const router = {
      register(url) {
        console.log('registered route!', url);
      },
    };
    return { router: router };
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
Router.childContextTypes = {
  router: PropTypes.object.isRequired,
};
```

`Route` expects to find `this.context.router`, and it registers itself when it's rendered:

```js
class Route extends Component {
  componentWillMount() {
    this.context.router.register(this.props.path);
  }
  render() {
    return <p>I am the route for {this.props.path}</p>;
  }
}
Route.contextTypes = {
  router: PropTypes.object.isRequired,
};
```

Finally, we can use the `Router` and `Route` components in our own app:

```js
const App = () => (
  <div>
    <Router>
      <div>
        <Route path="/foo" />
        <Route path="/bar" />
        <div>
          <Route path="/baz" />
        </div>
      </div>
    </Router>
  </div>
);
```

The beauty of context in this situation is that as library authors we can provide components that can work in any situation, regardless of where they are rendered. As long as all `Route` components are within a `Router`, it doesn't matter at what level, and we don't tie application developers to a specific structure.

## Conclusion

Hopefully this blog post has shown you how and when to use context in React, and why more often than not you'd be better eschewing it in favour of props.

Thank you to the following blog posts and documentation for providing great material whilst putting this blog post together:

* [React docs on context](https://facebook.github.io/react/docs/context.html)
* [How to safely use React context](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076) by Michel Weststrate.

Thank you also to [Arnaud Rinquin](https://twitter.com/ArnaudRinquin) for taking the time to review this post.
