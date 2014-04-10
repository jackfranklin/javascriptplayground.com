---
layout: post
title: Real life usages of ES6
---

Some of the features soon to be at our fingertips with the growing support for EcmaScript 6 are absolutely fantastic, but often examples shown online are contrived. In this blog post we'll pick out a few ES6 features and show you some real code that's improved with new features of the language.

## Support

ES6 support is mixed across platforms, so you shouldn't expect to start using this stuff today. Implementations are being added all the time, and I recommend using [The ES6 Compatability Table](http://kangax.github.io/es5-compat-table/es6/) to see the current state of affairs.

## Traceur

All the code examples seen in this post were run through [Traceur](https://github.com/google/traceur-compiler), a tool for compiling ES6 code into ES5 code which has a much better browser support at this time. It allows you to write ES6, compile it and use the result in environments where ES6 features are not implemented. Traceur is installed through npm:

```sh
npm install --global traceur
```

And then used on a source file like so:

```sh
traceur --out build.js --script my_source_file.js
```

## Arrow Functions

One of the quickest of quick wins, arrow functions allow us to write less and achieve more. Let's take a look at an example of mapping over an array and performing the same task on each element. The code below maps over an array of objects and turns them into an array containing just one particular property from each object:

```js
var users = [
    { name: 'Jack', age: 21 },
    { name: 'Ben', age: 23 },
    { name: 'Adam', age: 22 }
];

console.log(users.map(function(user) { return user.age; }));
// [21, 23, 22]
```

That's really nice, but also feels a little verbose having to type all that. With the new arrow functions, we can write it like so:

```js
var users = [
    { name: 'Jack', age: 21 },
    { name: 'Ben', age: 23 },
    { name: 'Adam', age: 22 }
];

console.log(users.map(user => user.age));
// [21, 23, 22]
```

Notice how much nicer that feels to read, as well as to type? It's much less code to achieve the same thing. We could then go about summing those ages:

```js
var users = [
    { name: 'Jack', age: 21 },
    { name: 'Ben', age: 23 },
    { name: 'Adam', age: 22 }
];

var ages = users.map(user => user.age);
var sum = ages.reduce((a, b) => a + b);
console.log(sum);
// 66
```

Because `reduce` takes two parameters, brackets are required to make it clear that the parameters are for the arrow function, not for the `reduce` call.

Arrow functions can have multiple statements within, in which case you need to use a block:


```js
var users = [
    { name: 'Jack', age: 21 },
    { name: 'Ben', age: 23 },
    { name: 'Adam', age: 22 }
];

var agesDoubled = users.map(user => {
    var age = user.age;
    return age * 2;
});
```

However, once you get to this stage it's a good sign that you probably want to be using regular functions - the benefit of the arrow function is definitely for small, one line methods.

## Default Parameters

Are you as fed up as I am of writing this?

```js
var something = function(a) {
    a = a || 2;
    return a * 2;
};
something() // 4
something(1) // 2
```

This is something that has to be done all the time and is found in nearly every JavaScript library out there. With ES6 though, we finally have proper built in support for default parameters:

```js
var something = function(a = 2) {
  return a * 2;
};
```

## Template Strings

Yet another thing I'm fed up of doing is this:

```js
this.log("Success: " + res.url + " was downloaded to " + output);
```

I spend a lot of my time writing Ruby, and in Ruby the string interpolation is lovely:

```ruby
log("Success: #{res.url} was downloaded to #{output}");
```

The good news is that this is here in JavaScript! Slightly differently to most languages to offer similar functionality, template strings in JavaScript are denoted with backticks:

```js
this.log(`Success: ${res.url} was downloaded to ${output}`);
```

This reads much nicer, is clearer and is easier to type too.

## Conclusion

It's an exciting time to be involved with JavaScript, and it feels to me like the language is really "growing-up" with some of these new features. If you'd like to try any of the examples shown in this post, [they are all on GitHub](https://github.com/javascript-playground/real-life-es6).

Additionally, keep an eye out for an upcoming post where we dive fully into the new modules system in ES6.


