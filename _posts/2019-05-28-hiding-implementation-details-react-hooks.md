---
layout: post
title: "Hiding implementation details with React hooks"
intro: Hooks are a great way to take some complex logic and hide it behind a nice facade. In this post we'll discuss the how, why and when of doing this.
---

It's fair to say that the
[introduction of hooks in React 16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html)
has really changed how we build React components. They certainly take some
getting used to, but once the concept clicks in your head it becomes clear that
they are a superior mechanism for building complex components when compared to
the old lifecycle methods.

One area where hooks shines is in reusing code across components. Those of you
who have been doing React for a long time will remember mixins (if you don't
it's not a problem as they are now removed from React!), which attempted to
solve sharing functionality across two components. After that people tackled the
problem of code-reuse with
[Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
and also [Render Props](https://reactjs.org/docs/render-props.html), but those
came with their own problems. I think that hooks are the best solution yet.

> Both Higher-Order Components and Render Props still have their place and use
> cases and they are still good patterns to have in your toolbox.

## Custom hooks can use hooks

The real moment for me was realising two things:

* custom hooks are just JavaScript functions and nothing more
* custom hooks can _call React hooks_

Suddenly, code reuse with hooks becomes as simple as _writing functions_. We've
all been doing this since we started programming; spotting some code that's
duplicated and wrapping it in a function. Custom hooks are just functions with a
convention that they start with the word `use`:

```js
const useCounter = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setCount(c => c + 1)
    }, 500)

    return () => clearTimeout(id)
  })

  return count
}
```

> You can see this running [on CodeSandbox](https://codesandbox.io/s/f7552).

Compare this to how you'd write a "regular" JS function:

```js
const counter = () => {
  let count = 0

  setTimeout(() => {
    count = count + 1
  }, 500)

  return count
}
```

You can see that whilst the hook version contains some React specifics (namely
the `useState` and `useEffect` calls), the logic is largely the same.

## The benefits of hidden implementation details

Until now in this post I've focused purely on the reuse benefits that hooks
provide. Continuing with the above example, now any component in our system can
easily use the `useCounter` hook and if we want to update that logic we can do
it in just one place. You can imagine this being a hook that provides logic for
user authentication, for example, rather than a slightly contrived blog post
demo.

There is another benefit to hooks (which also applies to JS functions): _hidden
implementation details_. The reason I think this is such a big benefit is
because when you're working on a codebase, you likely have a million things in
your head that you're thinking about. Say you're working on a component that
happens to use the `useCounter` hook, amongst other things, and this component
was written by your colleague. This is the first time you've worked with this
component so you're skimming the code to build up a picture in your head of what
it does. The beauty of seeing the `useCounter` hook is that _you do not have to
care or worry about how it works_. You can tell from seeing this line:

```js
const count = useCounter()
```

That it's going to give you a count, and from seeing it in the browser you'll
know that it increments. Compare that one line to the 10 lines above that
implement the `useCounter` hook. Reading the line that calls the hook is 10% of
the lines of code that the full hook implementation is, so you've just saved
yourself a bunch of space in your brain for something more important (and this
gap gets bigger with larger hooks).

The beauty of hooks is that they _let you lean on functionality without caring
about how it works_. Higher-Order Components and Render Props do this too, but
they introduce more ceremony and work to do it. Hooks are _just function calls_.

## When to extract a custom hook

As always in programming, the rules aren't clearcut. My advice for creating
custom hooks would be to feel the pain first: until you have logic that's
_exactly_ the same in _at least two components_, don't create a hook.
Pre-emptively creating one and trying to predict how you're going to use it is
probably going to leave you with an overcomplicated hook that doesn't do an
elegant job of solving your problems.
