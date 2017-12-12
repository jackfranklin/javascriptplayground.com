---
layout: post
title: "The new keyword in JavaScript"
---

The `new` keyword in JavaScript was an enigma to me for a long while, and only recently have I really begun to grasp it. In this article I'm going to attempt to succintly summarise the `new` keyword in JavaScript and the use cases.

First, let me pose a question. What will be logged to the console in this example?

    function foo() {
      this.x = 2;
      return this;
    }


    var y = foo();
    var g = foo();
    g.x = 3;
    console.log("y", y.x);
    console.log("g", g.x);
    console.log("this", this.x);

You might expect `y.x` to be `2`, as that's what it set to. However, you'll get the value `3` for every single logged output.

Within `foo()`, we set `this.x` to equal 2. `this` refers to the context in which the function was called.

**Update**: Thanks to some folks in the comments for correcting me on the value of `this` within `foo()`. My original explanation wasn't quite correct. Here's a better explanation that I've pulled together from the contributions of Mike McNally and others.

The value of `this` has nothing at all to do with the calling scope. If there's no explicit receiver in the expression from which is derived the function object reference, and neither `call` nor `apply` are involved, then the value of `this` in the called function will always be the global scope (or, in "strict" mode, undefined).

Hence here when we invoke `foo()`, `this` within `foo()` is the global object. So we're setting `x` on the global object - which would be `window` within a browser.

So although `y` and `g` point at separate invocations of `foo()`, the returned object is the global object. So when `g.x` gets set to three, this changes the global `x`, which is what `y.x` points at. [You can see this working on JSBin](http://jsbin.com/welcome/67131/).

So, how would we keep `y.x` and `g.x` separate? This is where the `new` keyword comes into play. If we change these lines:

    var y = foo();
    var g = foo();

To:

    var y = new foo();
    var g = new foo();

We will then get the right results. `y.x` will be 2, `g.x` will be 3, and `this.x` is undefined. There's one more change we should make to stick with convention - change the function from `foo()` to `Foo()`. Any function that should be invoked with the `new` keyword, should have a capital at the beginning. Here's the new example:
function Foo() {
this.x = 2;
}
var y = new Foo();
var g = new Foo();  

g.x = 3;
console.log("y", y.x);
console.log("g", g.x);
console.log("this", this.x);
You can [see this working on JSBin](http://jsbin.com/ekiqif/2/). So lets explore how and why this works.

`new Foo()` creates and instantiates a new instance of `Foo`, and the scope that comes with it. `Foo()` is known as a _constructor function_. [This MDN article gives a very brief but useful overview of constructors.](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/constructor).

[Dr. Axel Rauschmayer's post on inheritance](http://www.2ality.com/2012/01/js-inheritance-by-example.html) explains the job of a constructor:

> The constructor’s job is to set up the fresh object passed to it via the implicit parameter `this`. The fresh object is (implicitly) returned by the constructor and considered its instance.

Hence, `var y = new Foo()` creates and returns a new instance of the `Foo` class. Notice that in the `Foo()` method, we don't have to explicitly `return this`. Because `Foo()` is a constructor, `this` (the new object) is returned implictly.

The `new` keyword is not as dangerous or confusing as it can first appear. Although it can be confusing, and certainly is a little odd on first look, once you can grasp the basics and understand the use cases, it has its place.

If you'd like to read further, [this article on the Pivotal Labs blog](http://pivotallabs.com/users/pjaros/blog/articles/1368-javascript-constructors-prototypes-and-the-new-keyword) goes into good detail and a bit more in depth on the inner workings of the `new` keyword and prototypes. [This StackOverflow Question (and Answers)][1] also explores the `new` keyword in a lot of detail.

[1]: http://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript
