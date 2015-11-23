---
layout: post
title: Elm for JavaScript Developers
intro: In this post we'll explore Elm, a new programming language aimed at frontend developers, and some of its major features.
---

If you follow me on GitHub or Twitter you'll have noticed that I've been doing a lot of work with [Elm](http://elm-lang.org/) recently. Elm is a new language aimed at making it easier to build more robust, complex applications. It compiles to JavaScript but shares very little in common with the language, and its syntax will look familiar to anyone who's worked with Haskell. In the first of many posts about Elm, I'll talk through some of the major features of the language and why you should consider giving it a try. Don't be put off by its different syntax; once you get used to it you'll realise that it's a pleasure to work with.

## Immutability and Pure Functions

Every single piece of data you have in your Elm application is immutable. This means that it can never be modified, and will always be set to the value it was given when it was created. What this means in practice is that code is much easier to follow, because you know it hasn't changed. As an example, think about the below JavaScript code:

```js
var person = { name: 'Jack' };
doSomethingWith(person);
console.log(person);
```

Without executing that code, are you able to make any guarantees about the value of `person` once `doSomethingWith` has executed?

None.

Because objects in JavaScript are mutable, anything could have happened to `person`.

This is a fruitful source of bugs in larger applications. Functions that modify the state of the world, by mutating variables available to it, are functions with __side effects__. Functions like this are difficult to debug and harder to work with.  They are also harder to test and you should aim to avoid them whenever possible.

In Elm, every function is __pure__. This means two things:

- Given an input X, it will always result in output Y. If you give a function the same value, it will always produce the same result.
- The function has no side effects, and does not mutate anything or change the state of the world around it.

It's entirely possible to create functions like this in JavaScript, and you can make it a rule in your application that functions should be pure. Elm enforces it due to its immutable nature, and this means it's impossible for impure functions to sneak into your code base, either through code you write or through code in a 3rd party library you're using.

You might be wondering how you're expected to keep track of state in your application when you can't mutate values. This is entirely possible in Elm using Signals, and we'll visit it in a later article.

## Types

Elm is a statically typed language. This might sound off-putting, but it actually leads to far more robust applications. In Elm every value has a type.

```
"Hello World" - String Type
True - Boolean type
3 - number type
3.14 - Float type
[1, 2, 3] - List number type
```

You might think this is similar to JavaScript, and you'd be right. In JavaScript (and every other programming language), values have a particular type. The crucial difference comes when we pair this type system with functions. In JavaScript you might have a function that can take multiple types, and return multiple types:

```js
someMadeUpFn('Foo') => 5
someMadeUpFn(5) => 'Foo'
someMadeUpFn({ name: 'Jack' }) => { name: 'jack' }
```

Additionally, JavaScripts type system is __dynamic__, which means types are only decided at __runtime__, when your code is executed. Elm's type system is __static__, which means the compiler can figure out the types ahead of time. We'll come back to this later.

In the code above there are no restrictions on the types of the arguments that `someMadeUpFn` takes, and there's no restrictions on the type of the value it returns either. In Elm we have to explicitly declare all the types (actually, we could leave it up to the compiler to infer the types, but it's best practice to declare them). The below code creates a function `square` that takes an integer and returns another.

```
square : Int -> Int
square x = x * x
```

If I were to write the same function in JavaScript, I'd write:

```js
function square(x) {
  return x * x;
}
```

Notice the first line of our Elm function:

```
square : Int -> Int
```

This is a __type annotation__ that tells Elm that this function will take one argument which will be an integer, and return a value that's also an integer. That means if we try to call this function with a different data type, we'll get an error. Although this restriction can take some time to adjust to, it actually leads to much cleaner code that's easier to work with and follow. It also means you realise straight away if you're using a function incorrectly.

## Compiling

Above we noted that trying to call a function with the wrong types causes an error. Even better, we get these errors at __compile time__. Elm as a language compiles to JavaScript, and we need to run the compiler to generate JavaScript from our Elm code. Elm's compiler is smart, and is able to check the types of values when it compiles our code into JavaScript. For example, if I take this Elm code and try to compile it, we'll get an error. Don't worry about the specifics of the syntax, but know that this code will call the `square` function with the argument `"Hello"`.

```
square : Int -> Int
square x = x * x

main =
  square "Hello"
```

Here's what the compiler gives me:

```

The argument to function `square` is causing a mismatch.

5│   square "Hello"
            ^^^^^^^
Function `square` is expecting the argument to be:

    Int

But it is:

    String
```

How great is that?! The compiler detected our mistake, and rather than getting an odd error when we run the code in the browser, we instead see a much nicer error telling us of our mistake ahead of time.

## Getting started with Elm

I hope that this post has peaked your interest in this language. In the coming weeks I'll be posting more about Elm and how to get started, but if this post has you eager for more here's some resources I'd recommend:

- [Comparison of Elm and JS Syntax](http://elm-lang.org/docs/from-javascript)
- [Elm syntax introduction](http://elm-lang.org/docs/syntax)
- [Elm video course ($24 but recommended)](https://pragmaticstudio.com/elm)
- [My Game of Life implementation in Elm](https://github.com/jackfranklin/elm-game-of-life)
- [Connect Four in Elm](https://github.com/jackfranklin/elm-connect-four)

