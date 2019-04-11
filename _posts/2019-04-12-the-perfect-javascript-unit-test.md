---
layout: post
title: "The perfect unit test"
intro: Today we're talking about how to write the perfect unit test and how to ensure your tests stay readable, usable and maintainable.
---

There's a common theme I find with people who tell me that they don't find unit
testing useful, and it's normally that they are writing bad tests. This is
completely understandable, particularly if you're newer to unit testing. It's
_hard_ to write good tests and it takes practice to get there. All the things
we're going to talk about today were learned the hard way; the pain of bad unit
tests lead me to creating my own rules for how to write a good unit test. It's
these rules that we're going to talk about today.

## Why are bad tests so bad?

When you have application code that is messy, it's hard to work with. But
hopefully you have some tests alongside it, and those help you. It's OK to work
with hard code if you've got tests backing you up. That confidence tests give
you can go along way to erasing the effect of bad code.

Bad tests don't have any code to help you work with them. You don't write tests
for your tests. You _could_, but then you'd have to write tests for your tests
for your tests and that's a spiral none of us want to go down...

## Characteristics of bad tests

It's hard to define a set of traits that make a bad test, because a bad test is
really any test that doesn't follow the rules we're about to talk about.

If you've ever looked at a test and had no idea what it's testing, or you can't
obviously spot the assertion, that's a bad test. A test with a poorly written
description (`it('works')` is a personal favourite) is a bad test.

Tests are bad if _you don't find them useful_. The _entire point_ of having
tests is to increase your productivity, workflow and confidence in your
codebase. If a test isn't doing that (or actively making it worse), it's a bad
test.

I firmly believe that bad tests _are worse_ than no tests.

## Characteristics of a good test

The good news is that the rules of a good test are easy to remember and very
intuitive once you've got used to them!

A good test has a _succinct, descriptive name_. If you can't come up with a
short name, prefer clarity over saving on line length.

```js
it('filters products based on the query-string filters', () => {})
```
