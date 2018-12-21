---
layout: post
title: "Adventures with ReasonML"
intro: For one week only, you can grab 40% off all my video courses.
githubPath: 2018-11-22-black-friday-react-sale
---

If you follow me on Twitter, or have read this blog for a while, you'll probably
know that I'm a big fan of [Elm](https://elm-lang.org/). It's a functional,
strictly typed language that compiles to JavaScript and is a great alternative
to JavaScript for building web applications.

That said, it's not the only contender in this space.
[Reason](https://reasonml.github.io/) is also a very popular option that has
gained a lot of traction recently. I've always been interested in trying it out,
and [Advent of Code](https://adventofcode.com/), a series of coding challenges
posted each day leading up to Christmas, gave me a great excuse.

> If you're into Elm, you might also be interested to know that I've done two
> videos completing Advent of Code challenges in Elm that you can find
> [on Youtube](https://www.youtube.com/watch?v=pF8gSF5QlP8).

If you're eager to skip ahead into the code, you can
[find it all on GitHub](https://github.com/jackfranklin/advent-of-code-2018/tree/master/day-two-reason-ml).
In the rest of this post I'll talk you through my approach to getting up and
running with Reason, and my thoughts on the language after trying it. I am _not_
a Reason expert, so if you spot any errors or things I've misunderstood, please
let me know! Equally, there might be better ways of solving the task, so if you
have any suggestions please get in touch.

## Getting started

I followed the official
[Installation and getting started](https://reasonml.github.io/docs/en/installation)
guide to get easily up and running. It involved installing the compiler,
[BuckleScript](https://bucklescript.github.io/), which is what takes Reason and
produces JavaScript.

That let me run:

```
bsb -init my-new-project -theme basic-reason
```

To get a basic project up and running! I also installed
[reason-vscode](https://marketplace.visualstudio.com/items?itemName=jaredly.reason-vscode)
so that I had nice error highlighting and type hinting as I coded. I find this
particularly useful when working with a new language/framework that I'm not
super familiar with.

## Writing tests

I didn't want to build a UI to solve the Advent of Code problem; so I did a bit
of googling to see if I could use Reason to write some unit tests, and solve the
problem in a TDD style. I managed to find
[bs-jest](https://github.com/glennsl/bs-jest), a library that adds bindings to
BuckleScript to the JS testing framework Jest. This lets us write Reason, but
have it compiled into JavaScript that we can then run with Jest as normal. So
we'll write a `tests.re` file, have it compiled into `tests.js`, and then run
`jest tests.js`. Setting this up was just a case of following the instructions
in the README, and it worked perfectly.

## The Advent of Code challenge

I was taking on [Day Two](https://adventofcode.com/2018/day/2), and for this
exercise only completed Part One. I'll leave Part Two as an exercise for you!

The first part of the exercise needed me to take a string, such as `bababc`, and
calculate the frequencies that letters occur. So for this string, we'd end up
with:

```
{ a: 2, b: 3, c: 1 }
```

So that was the first thing I set out to write. I discovered that BuckleScript
provides a
[`Js.Dict`](https://bucklescript.github.io/bucklescript/api/Js.Dict.html) module
that is the equivalent of a native JS object, and I could use that. It also
provides
[`Js.Array`](https://bucklescript.github.io/bucklescript/api/Js.Array.html), and
[`Js.String`](https://bucklescript.github.io/bucklescript/api/Js.String.html).
Using a combination of methods from these modules, I could split my input, and
loop over it, updating a dict with new frequencies as I go through each letter.

I decided to store the frequencies in a dictionary. In Reason you have to decide
what the types of the values are in a dictionary, so I went with integers, given
we're counting frequencies.

I first set out to write a function that could take a dictionary and a letter,
and update the frequency for that letter:

* If the letter has no entry in the dictionary, create one and set the frequency
  to one.
* If the letter has a frequency, update the count by one.

Defining this function looks very similar to JavaScript:

```reason
let incrementOrSetFrequency =
  (frequencies: Js.Dict.t(int), letter: string): Js.Dict.t(int) => {
};
```

The bit that Reason adds is the type annotations. After each of the two
arguments, we declare the types. We don't have to do this - Reason will be able
to infer them for us - but I find it helps me work with code if I've documented
the type, and very rarely the compiler can infer a type slightly differently to
what you actually want it to be.

The type annotation above says that `frequencies` is a `Js.Dict.t(int)`, which
means a dictionary where each value is an `int` type. `letter` is a `string`.
After the arguments we have the return type, which is also a dict, as we want to
take the dict, update it, and then return it again.

The first thing we need to do is check to see if `letter` is in the dictionary,
and we can use `Js.Dict.get(frequencies, letter)` to do this. It doesn't return
the value or `undefined` though, like you would expect in JavaScript. Instead,
it returns something that's an `Option` type. This is Reason's way of trying to
avoid unexpected `undefined` or `null`s in your application. You can read more
about
[`Option` on the Reason docs](https://reasonml.github.io/docs/en/null-undefined-option).

When you have a function that returns an `Option` type, you can use
[pattern matching](https://reasonml.github.io/docs/en/pattern-matching) to see
what the value is, and act accordingly. So if we look in our dictionary for our
letter and it returns `None`, we need to add the letter. If it returns
`Some(int)`, we want to increment it by one:

```re
let incrementOrSetFrequency =
    (frequencies: Js.Dict.t(int), letter: string): Js.Dict.t(int) => {
  switch (Js.Dict.get(frequencies, letter)) {
  | Some(x) =>
    Js.Dict.set(frequencies, letter, x + 1);
    frequencies;
  | None =>
    Js.Dict.set(frequencies, letter, 1);
    frequencies;
  };
};
```
