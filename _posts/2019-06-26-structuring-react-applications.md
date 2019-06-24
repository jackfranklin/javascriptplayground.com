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
applications:

## Don't worry too much

## Tests alongside source code

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
