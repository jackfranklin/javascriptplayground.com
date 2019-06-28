---
layout: post
title: "Structuring React applications"
intro: "Today's post lays out my current thinking and approach to structuring React applications: the folder structure I use, my naming conventions, where I write tests, and so on."
---

One of the best features of React is that it doesn't force much convention and
leaves a lot of decisions up to the developer. This is different from say,
EmberJS or Angular, which provide more out of the box for you, including
conventions on where and how different files and components should be named.

> My personal preference is the React approach as I like the control, but there
> are many benefits to the Angular approach too. This comes down to what you and
> your team prefer to be working with.

Over the years I've been working with React I've tried many different ways of
structuring my applications. Some of these ideas turned out to be be better than
others, so in today's post I am going to share all the things that have worked
well for me and hopefully they will help you too.

> This is not written as the "one true way" to structure your apps: feel free to
> take this and change it to suit you, or to disagree and stick to what you're
> working with. Different teams building different applications will want to do
> things differently.

It's important to note that if you loaded up the
[Thread](https://www.thread.com) frontend, you would find places where all of
these rules are broken! Any "rules" in programming should be thought of as
guidelines - it's hard to create blanket rules that always make sense, and you
should have the confidence to stray from the rules if you think it's going to
improve the quality of what you're working on.

So, without further ado, here's all I have to say on structuring React
applications, in no particular order.

## Don't worry too much

This might seem like an odd point to get started on but I genuinely mean it when
I say that I think the biggest mistake people make is to stress too much about
this. This is especially true if you're starting a new project: it's impossible
to know the best structure as you create your first `index.jsx` file. As it
grows you should naturally end up with some file structure which will probably
do the job just fine, and you can tweak it as pain points start to arise.

If you find yourself reading this post and thinking "but our app doesn't do any
of these!" that's _not a problem_! Each app is different, each team is
different, and you should work together to agree on a structure and approach
that makes sense and helps you be productive. Don't worry about changing
immediately how others are doing it, or what blog posts like this say is most
effective. My tactic has always been to have my own set of rules, but read posts
on how others are doing it and crib bits from it that I think are a good idea.
This means over time you improve your own approach but without any big bang
changes or reworks 👌.

## Tests alongside source code

Let's start the points with an easy one: keep your test files next to your
source files. I'll dive into more detail on how I like to structure all my
components so their code is next to each other, but I've found my preference on
tests is to name them identically to the source code, in the same folder, but
with a `.test` suffix:

* `auth.js`
* `auth.test.js`

The main benefits of this approach are:

* it's easy to find the test file, and easy at a glance to see if there are even
  tests for the file you're working on
* all imports that you need are easier: no navigating out of a `__tests__`
  directory to import the code you want to test. It's as easy as
  `import Auth from './auth'`.

## CSS Modules

## One folder per main component

## Nested folders for sub components if required

## Mostly one component per file

## Truly generic components get their own folder

## Make use of import aliasing to avoid `../../` imports

## A generic "lib" folder for utilities

## Use `.jsx` for React and `.js` for everything else

## Use error tracking and wrap it in your own utilities

## Hide 3rd party libraries behind your own API so they are easily swappable

## Always use `prop-types` (or TypeScript/Flow)

## Avoid event emitters
