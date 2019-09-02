---
layout: post
title: "Avoiding bugs with data structures: using Sets in JavaScript"
intro: "Today we're looking at how you can avoid bugs for free by picking the right data structures for what you're working with."
---

When working on a part of a user interface I like to constantly try to think
about potential bugs that could occur, potentially when looking at taking input
from users. Most components that take input will have code to prevent invalid
input and bugs and you can't ever avoid this, but sometimes the right data
structure can remove the amount of bugs you'll have to write code to deal with.

To demonstrate this we'll be working today with a component that lets a user tag
something with tags. The GIF below shows two versions; the first has a bug and
the second doesn't. We'll talk about why in just a moment...

<img src="/code-for-posts/sets/example.gif" width="500" />

The great thing is that the second example _has no code to explicitly deal with
that bug_; it uses a more appropriate data structure that makes this bug
impossible.

When working with a list of data where one of the constraints is that there is
no duplication, I like to reach for a JavaScript
[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
Sets were introduced in ES2015 and allow you to store unique data. If you try to
add some data to a set that it already has, it won't do anything. So it's
_literally impossible_ for a set to contain duplicate values, and we can
leverage this for our tags component.

## Working with sets

Rather than create my tags state as an array, I instead use a set. You
initialise a set by giving it an array of items:

```js
const [tags, setTags] = React.useState(new Set(['react', 'javascript']))
```

> Be careful, `new Set('react')` gives you a set with 5 items; `r`, `e`, and so
> on. You probably want `new Set(['react'])` 👍.

You add an item to a set by calling the `add` method:

```js
const names = new Set()
names.add('jack')
names.add('jack') // does nothing!
```

Be careful though: adding to a set mutates the set. When working with React you
typically want to avoid mutating data and instead create new instances. You
could use a [library such as Immer](https://github.com/immerjs/immer) to make
this easier, or pass the set into the `Set` constructor:

```js
const names = new Set(['alice'])

const newNames = new Set(names)
newNames.add('bob')

// newNames = alice, bob
// but names is left alone
```

Using this within our `Tags` component looks like so:

```js
const [tags, setTags] = React.useState(new Set(['react', 'javascript']))

const addTag = newTag => {
  setTags(oldTags => {
    const newSet = new Set(oldTags)
    newSet.add(newTag)
    return newSet
  })
}
```

It's worth noting at this point that this code is slightly more verbose than if
we'd have used an array, where we could have done:

```js
const addTag = newTag => {
  setTags(oldTags => [...oldTags, newTag])
}
```

But if you wanted, you could make the set equivalent slightly more concise:

```js
const addTag = newTag => {
  setTags(oldTags => new Set([...oldTags, newTag]))
}
```

> This is probably what I'd do in a real app - but I'll stick with the slightly
> longer example for this post as I think it's clearer if you're not super
> familiar with using Sets.

If you create a set with the same values in twice, only one will persist. The
code below creates a set with just one item, set to `'alice'`:

```js
new Set(['alice', 'alice'])
```

## Rendering sets in React

There's one more gotcha with sets: they don't have common array methods like
`map`, which is commonly used in React to map an array to a list of components:

```jsx
<div>{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
```

This is easily solved by converting a set to an array. You can use the spread
operator to do this, or use `Array.from`. Either works:

```js
const set = new Set(['alice'])

[...set] // works!

Array.from(set) // also works!
```

I tend to prefer `[...set]` as it's cleaner, but this is personal preference so
pick your favourite.

## Bug avoided! 🐛

Swapping our data structure from an array to a set has completely removed the
ability for the user to ever enter duplicates because _the data structure
forbids it_. This means we don't have to write code to filter duplicates our,
and that we don't have to write tests for it (I wouldn't test something that's
provided natively by the language) and we can focus on all the other concerns
this component has.

Whenever you're working with some data that has some validation requirements or
constraints it's a good idea to pause and think if you could use a data
structure that helps provide some of those constraints out the box with no extra
effort on your part.

> If you enjoyed this post, you might enjoy
> [this post on impossible states with data structures](/avoiding-impossible-states-react/).
