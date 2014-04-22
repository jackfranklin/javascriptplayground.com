---
layout: post
title: Real Life ES6 - Arrow Functions
---

Some of the features soon to be at our fingertips with the growing support for ECMAScript 6 are absolutely fantastic, but often examples shown online are contrived. In this series of blog posts, we'll pick out a few ES6 features and show you some real code that's improved with new features of the language.

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

Another handy feature of arrow functions is the lexical binding of `this` to a function. As you'll probably know already, when you create a new function, the `this` keyword is set to a value depending on the way a function is called, and the rules as to what `this` might be defined as [are notoriously convoluted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Let's see how arrow functions might help us out here, using a trivial example of creating an API wrapper that returns a Promise (another great ES6 feature that we'll cover very soon). Consider the following example:

```js
function API () {
  this.uri = 'http://www.my-hipster-api.io/';
}

// let's pretend this method gets all documents at
// a specific RESTful resource...
API.prototype.get = function (resource) {
  return new Promise(function (resolve, reject) {
		// this doesn't work
		http.get(this.uri + resource, function (data) {
			resolve(data);
		});
  });
};

var api = new API();

// by calling this method, we should be making a request to 
// http://www.my-hipster-api.io/nuggets
api.get('nuggets').then(function (data) { console.log(data); }); 
```

So what's wrong here? Well, aside from not being the best example of Promise usage in the world (it's generally considered  a bit of an anti-pattern to wrap a callback function in this way), `this.uri` is `undefined` so when we come to call our `http.get()` method that we're wrapping, we can't properly form the URL we need. Why would this be? Well, when we call `new Promise()`, we're calling a constructor of another object, which creates a new lexical `this` in turn. Put simply, `this.uri` is not in scope.

Today, we can work around this in a few ways. We could have written something like this:

```js
API.prototype.get = function (resource) {
  var self = this; // a-ha! we'll assign to a local var
  return new Promise(function (resolve, reject) {
		// this works!
		http.get(self.uri + resource, function (data) {
			resolve(data);
		});
  });
};
```

...and, lo and behold, it works! By creating a variable that points to `this`, we can access it from any of our inner functions. In fact, if we were to use Traceur to transpile our ES6 into ES5 compatible code, it actually outputs something very similar to the above pattern. But we shouldn't have to do this, right? Surely there must be a way for us to define `this` ourselves? If we're working inside an environment where we have ES5 features (IE9 or above), we could use `.bind()`, which is a [method on the `Function` prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) that allows us to "bind" (funnily enough) a value a function's lexical `this`.

```js
API.prototype.get = function (resource) {
  return new Promise(function (resolve, reject) {
		// this works!
		http.get(this.uri + resource, function (data) {
			resolve(data);
		});
  }).bind(this); // wow such bind very this
};
```

Cool, but this could be a little tidier. If we decide to nest a few callbacks within each other, and they all need access to the outer function's `this` keyword, then we have to affix `.bind()` to every nested function. There are also [performance implications in using `.bind()`](http://stackoverflow.com/questions/18895305/will-function-prototype-bind-always-be-slow), but likely (hopefully) these will be fixed in due time.

Enter arrow functions! In ES6, the same function above could be defined like this:

```js
API.prototype.get = function (resource) {
  return new Promise((resolve, reject) => {
		http.get(this.uri + resource, function (data) {
			resolve(data);
		});
  });
};
```

It certainly looks a bit more concise, but what's the arrow doing? Well, it actually binds the context of the Promise's `this` to the context of the function that contains it, so `this.uri` resolves to the value we assigned in the constructor. Awesome!

[add a closing paragraph here]



