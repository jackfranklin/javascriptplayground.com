---
layout: post
title: "Avoiding recursive useEffect hooks in React"
intro: A short post today about an easy tactic to avoid your useEffect calls becoming recursive when setting state.
---

It's fair to say that React 16.8 and the introduction of
[hooks](https://reactjs.org/docs/hooks-intro.html) has really changed how we
write React. Hooks are one of those APIs that make you realise the flaws of the
previous approach _after_ you stop using it. I remember being very skeptical of
hooks when they were first released, not thinking that the previous class based
design had many flaws, but I've since come to realise I was very wrong, and
hooks are a vast improvement on how we build React components. If you're
interested in comparing the old vs the new, I wrote a
[blog post refactoring a component to use hooks](/refactoring-to-react-hooks/)
that offers a nice comparison.

One area that has taken me some time to get used to is the dependency array of
the `useEffect` hook. This lets you tell React when it should rerun the effect:

```js
useEffect(
  () => {
    console.log('I run when `a` changes')
  },
  [a]
)
```

This `useEffect` will be run:

* when the component is first mounted
* whenever the variable `a` changes.

But this lead me to quite often end up with recursive calls to `setEffect`,
where I'd need to rely on some state in order to update its value:

```js
const [count, setCount] = useState(0)

// this is going to go on forever
// because the effect relies on the `count` variable
// and then updates the `count` variable
// which triggers the effect
// and so on...
useEffect(
  () => {
    setCount(count + 1)
  },
  [count]
)
```

This is a contrived example for the purpose of demonstration, but I also had
bigger examples where we had an object in state with many keys and values, and
we needed to read in the object and update one part of it:

```js
const [userData, setUserData] = useState({
  name: 'Jack',
  friends: ['alice', 'bob'],
})

// also runs infinitely for the same reasons as above
useEffect(
  () => {
    const newUser = {
      ...userData,
      friends: [...userData.friends, 'charlie'],
    }

    setUserData(newUser)
  },
  [userData]
)
```

The solution lies in how we call the set state functions (in the prior code
example, `setUserData` is the "set state" function). There are two forms to
these functions:

```js
setUserData(newUser)
setUserData(function(oldUser) {
  const newUser = {}
  return newUser
})
```

The first takes the new value and sets it. The second takes _a function that is
called with the old value_ and is expected _to return the new value_. Let's take
the previous `useEffect` code example and update it to use the second form of
the set state function:

```js
const [userData, setUserData] = useState({
  name: 'Jack',
  friends: ['alice', 'bob'],
})

// doesn't run infinitely! 👌
useEffect(() => {
  setUserData(oldUser => {
    const newUser = {
      ...oldUser,
      friends: [...oldUser.friends, 'charlie'],
    }
    return newUser
  })
}, [])
```

Do you notice what's different here? We no longer have to depend on `userData`,
because we read it from the callback function that we give to the set state
function! This means that our `useEffect` call is free to modify and set the new
user data without fear of recursion because it reads the old value by being
given it via the set state function. Therefore we can lose it from our
`useEffect` dependencies array, meaning that `useEffect` won't rerun when it
changes!

My experience of this was that once I spotted this trick it made the `useEffect`
hook really click in my head. I've come to use the set state function variant
much more frequently - in fact, nearly exclusively inside `useEffect` calls, and
I recommend giving it a go.
