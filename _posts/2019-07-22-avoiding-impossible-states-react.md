---
layout: post
title: "Making impossible states impossible: data structures in React"
intro: "Today we're talking about avoiding bugs by structuring your data such that the bug can never occur."
---

One of the things I like to spend a lot of time on is data structures. It's one
of the first things I think about when building something: what data do I have
to work with, and what's the best format for it to be in?

In my experience if you can get the data format correct everything else should
fall into place; a data structure that allows you to read and manipulate the
data easily is going to be much nicer to work with. You want the data structure
to do as much of the work for you as it can and it should work with you and not
feel like it gets in your way.

Interestingly, I think because of the strictly typed nature of the languages, I
find myself taking this approach much more when I'm working with Elm or
TypeScript: something about the presence of types leads me to think about
defining the types I'll use through my application - and this leads to me
thinking about data structures. Today we're going to look at a JavaScript
example where we'll strongly consider the datatype that we use to solve a
problem.

## Making impossible states impossible

There is a very popular Elm talk titled
["Making Impossible States Impossible"](https://www.youtube.com/watch?v=IcgmSRJHu_8)
by [Richard Feldman](https://twitter.com/rtfeldman) which has become my
reference of choice for this topic. I highly recommend watching the video - even
if you don't like or know Elm - because the approach transcends any given
language. The example for this blog post is also taken from that talk because
it's perfect for what I want to discuss, so thank you Richard!

## Tabs

Every frontend developer has built a tabbed interface at one point in their
lives, and it's these that we'll look at today. We'll have some tabs at the top
of the page and then show the content for the currently active tab below it.

> Today I'll be using React for the UI but this is not important for the topic -
> feel free to swap React for your framework of choice 👍

We have two bits of information that we have as data:

* all the tabs: their title and their content
* some data to know which tab is active and therefore which tab to highlight and
  which content to show

Feel free to think for a moment about how you'd model this data.

This is my first pass, and I'm confident that I'm not the only one who would
take this approach:

```js
const [activeIndex, setActiveIndex] = React.useState(0)

const tabs = [
  { title: 'Tab One', content: 'This is tab one' },
  { title: 'Tab Two', content: 'This is tab two' },
  { title: 'Tab Three', content: 'This is tab three' },
]
```

> I'm hardcoding `tabs` here but let's imagine in reality we're building a Tab
> library that others will consume and pass in the tabs.

## The critical question: what impossible states does this data structure permit?

When we're thinking about data structures and how to improve them this is the
question you want to be asking yourself. Take the data structure that you've
come up with and see if you can set values that cause impossible states. For
example, I can:

```js
const [activeIndex, setActiveIndex] = React.useState(4)

// omitted the contents to save space
const tabs = [{}, {}, {}]
```

In this state I've set the `activeIndex` to `4` (which would mean the 5th tab as
arrays are zero-indexed in JavaScript), but we only have three tabs. So this
state is impossible!

At this point you might be thinking that it doesn't matter that this state
_could_ exist, because we can write code to ensure that it can't exist. And that
is true: we could write code to ensure that `activeIndex` never gets set a value
that is out of bounds. And we could ensure all our click event listeners for our
tabs only set valid `activeIndex` values. But if we had a data structure that
didn't allow this impossible state, we _wouldn't have to write any of the code
we just spoke about_. And that's the value of thinking of data structures that
ban impossible states: they remove even the slightest chance of certain bugs
ever occurring because _the data doesn't allow them to_.

> In JavaScript land technically every data structure we come up with will allow
> an invalid state because we could set any value to `undefined` or `null`. This
> is where the typed languages have an edge: when you can ensure at compile time
> that a certain value must exist, you can create data structures that truly
> make impossible states impossible. For today's post we'll take the leap of
> hoping that values that we expect to be present are indeed present.

Whilst it's very hard to come up with a data structure that avoids _any_
impossible state, we can work on creating data structures that avoid _obviously
invalid states_, such as the problem above.

## An alternative data structure

So if we want to avoid the problem of the `activeIndex` being an invalid number,
how about we remove it entirely and track which tab is active:

```js
const [activeTab, setActiveTab] = React.useState(tabs[0])
const [restOfTabs, setRestOfTabs] = React.useState(tabs.slice(1))
```

In this approach we split the actual tab object out and remember which one is
active. This does mean we will need a new key on each tab to know which order to
render them in, as we've lost the nice ordered array they were in, but maybe
this is a price worth paying for this data structure. Is this better or worse
than the previous attempt? And crucially: does it allow any invalid states?

If we assume that our code won't go rogue and set values to `null` (as
previously mentioned, this is where some types and a compiler would come in
handy), it's harder to get this data into an invalid state. When a user clicks
on a tab we can swap which tab is the `activeTab`. However there is a big red
flag to me here: two co-located `useState` calls with very related bits of data.

This data structure opens us up to problems by storing two values in the state
together. Whenever you see two state values that are tightly related you are
likely to be opening yourself up to bugs where these values get out of sync. You
can either rethink how you are modelling your data, or reach for the
[`useReducer` hook](https://reactjs.org/docs/hooks-reference.html#usereducer),
which allows you to update multiple bits of state at once.

The fact that this data structure loses a key feature of our tabs - their
ordering - is also a red flag. We'll have to either ask the consumer of our
module to pass in objects with an `order` key, or do it ourselves. When you find
yourself having to mutate data to add properties you need because your data
structure doesn't provide it, that's a sign that maybe the data structure isn't
quite right.

## Zip lists

Let's look at a final data structure: the zip list. The zip list breaks down a
list where we care about the active state into three parts:

```js
// before:
const tabs = [tabOne, tabTwo, tabThree]

// after:
const tabs = {
  previous: [tabOne],
  current: tabTwo,
  next: [tabThree],
}
```

The advantages of this approach over our last two are:

1. We keep the ordering of the tabs and can easily construct an array of them
   (`[...tabs.previous, tabs.current, ...tabs.next]`).
2. We now have to have a current tab at all times. And because we'll construct
   this data structure from the initial array of tabs the user gives us, we can
   be pretty confident of avoiding some of the impossible states this data
   structure does allow (duplicated tabs).
3. All our data is in one object: the previous attempt split the tabs up into
   two pieces of state which could more easily get out of sync: here we've got
   just one.

> Notice how we still have impossible states here: `tabs.previous` could contain
> the same tab as `tabs.current`, which would be a bug. But because it's all in
> one piece of data that we are going to write code to manipulate we can have
> close control over this and those bugs are less likely than two individual
> pieces of state becoming misaligned.

Let's start our initial zip list implementation and see how we go. I'll create a
function that takes in the initial array, sets the first item as active (in the
future we might allow the user to tell us which tab is active) and then create
our data structure:

```js
const zipList = initialArray => {
  const [initialActive, ...restOfTabs] = initialArray

  const zip = {
    previous: [],
    current: initialActive,
    next: restOfTabs,
  }

  const setActive = zip => newActive => {
    // TODO: fill this in
    const newZip = zip
    return apiForZip(newZip)
  }

  const apiForZip = zip => ({
    asArray: () => [...zip.previous, zip.current, ...zip.next],
    isActive: tab => zip.current === tab,
    setActive: setActive(zip),
    activeTab: () => zip.current,
  })

  return apiForZip(zip)
}
```

When creating custom data structures the key is to _hide the raw data behind a
nice API_. If you expose the raw data it's hard to change that structure because
people might rely on it, and in a mutable language world like JavaScript people
could reach in and change your data in whatever way they like. Notice how the
`zip` object is not exposed and instead we provide a small API.

In our React component we can still map over tabs by doing
`tabs.asArray().map(...)`, and we can determine the active tab via the
`isActive()` function. The `activeTab()` function lets us fetch the active tab
so we can show its content on the page. The final piece of the jigsaw is
`setActive`, which needs a bit more thought. This is where we are going to write
more code than if we'd have taken the `activeIndex` approach, but we're trading
that off against the higher confidence we have in this data structure.
_Programming is all about trade-offs, after all!_.

So we can move the tabs in our component into a piece of state:

```js
const [tabs, setTabs] = React.useState(
  zipList([
    { title: 'Tab One', content: 'This is tab one' },
    { title: 'Tab Two', content: 'This is tab two' },
    { title: 'Tab Three', content: 'This is tab three' },
  ])
)
```

And we can use the `setTabs` function to update the state when a user clicks on
a tab (ensuring that our zip list's API returns a new zip list from the
`setActive` call):

```jsx
{
  tabs.asArray().map(tab => (
    <li
      key={tab.title}
      onClick={() => setTabs(tabs.setActive(tab))}
      className={`${tabs.isActive(tab) ? 'border-red-800' : 'border-gray-800'}`}
    >
      {tab.title}
    </li>
  ))
}
```

The `setActive` function takes a bit of thought to get right in terms of
updating the values. Let's say we have this state:

```js
const zip = {
  previous: [tabOne, tabTwo],
  current: tabThree,
  next: [],
}
```

And now we click on `tabOne`. We need to make the data structure become:

```js
const zip = {
  previous: [],
  current: tabOne,
  next: [tabTwo, tabThree],
}
```

To do this we can follow a set of steps:

1. Figure out where the new active tab is: `previous` or `next`. For this
   example it's in the `previous` state.
2. We now need to split `previous` into two lists: the previous items that
   appear _before_ the new active tab, and the items that appear _after_ it. We
   need this because the ones that appear before need to _stay in the previous
   list_, but the items that appear after the item that's about to become active
   need to _go into the next list_.
3. We can then construct the new zip:
   ```js
   const newZip = {
     previous: [...previousItemsBeforeActive],
     current: newActive,
     next: [...previousItemsAfterActive, zip.current, ...zip.next],
   }
   ```

And with that we now have a functioning set of tabs with a zip list
implementation 👍.

## That was...a lot of work?!

That might feel like an awful amount of work to go through just to get some tabs
listed on the screen. And to some extent, it was! But we've definitely gained
benefits from doing this work. Firstly, the Zip List isn't specific to tabs:
whenever you find yourself having a list of things where one is considered
active in some form, this data structure is a great one to reach for. And you
now have a reusable implementation of a zip list ready to be used whenever the
time comes.

I've lost count of the number of bugs I've had because an `activeIndex` type
tracker got out of sync: in our zip list we don't rely on any other data:
there's one object that controls everything about which item is active. That's
going to pay off in terms of bugs we've avoided, for sure.

Is building a data structure like this worth it _every single time_ you have
some tabs and you want to show one as active? Possibly not - that's up to you.
As always in programming, it depends. But I hope this blog post inspires you to
think more carefully about data structures and ask how you can structure them to
work with you and help rule out impossible states.

## NPM Package

I have published the Zip List implementation (well, a slightly tweaked one) as
an npm package so you can use them without having to implement them! You can
find the repository [on Github](https://github.com/jackfranklin/zip-list/) and
install it via npm or Yarn today 🎉:

```
yarn add @jackfranklin/zip-list
npm install @jackfranklin/zip-list
```
