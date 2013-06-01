---
layout: post
title: "Your First Polyfill"
---

In today's tutorial I want to introduce you to the concepts behind polyfills, a word you see used a lot in today's JS world. I'll demonstrate just what a polyfill is and then write one ourselves.

A polyfill is a piece of code that provides a fallback if a certain feature doesn't exist within that browser's JS engine. Polyfills usually follow a pattern. First, they check to see if the function they implement exists, and then we only write our fallback implementation if we have to.

There are multiple polyfills out there for mutliple functions. The website [HTML5 Please](http://html5please.com/) is very useful for finding polyfills to do a particular job.

Now, lets get to our own implementation. I should note as this point that this implementation is by no means going to be a fully fledged, comprehensive one. At the end, I'll link you to the Mozilla Documentation Network (or MDN) page that contains a hugely comprehensive & fully featured polyfill, should you require it.

Today we'll be implementing `Array forEach`, which was introduced in JavaScript 1.6, ECMAScript 5th edition. In reality, this is actually a very well supported feature, but I've chosen it more for the fact that it's a fairly simple implementation.

The first thing we need to do is see if the method has been natively implemented. We do this by checking to see if `Array.prototype.forEach != undefined`. If it is indeed undefined, we can continue. What this function does is iterate through all items within an array and call a function on them. This function is passed 3 arguments: the item, the index & the array it's iterating on. It's also possible to pass in to `forEach` a second value, which will be used as the value for `this` within the callback.

With that in mind, lets implement it! At this point, I'm presuming the method is not natively supported, and we need to implement it. Our first line simply defines the function:

    Array.prototype.forEach = function(callback, thisArg) {

Next, we need to check if `callback` is a function or not, and throw a `TypeError` if it's not:

    if(typeof(callback) !== "function") {
        throw new TypeError(callback + " is not a function!");
    }

Once we've got this far, we know that the callback is a valid function, so now all that's left to do is loop through our array. Firstly, I save the length of the array:

    var len = this.length;

Then we can loop through:

    for(var i = 0; i < len; i++) {
        //callback here
    }

Remember, we have to pass three things into the callback. So we _could_ do:

    callback(this[i], i, this)

But how do we go about applying the value of `this` within the callback? We can use JavaScript's `call()` method ([MDN Link](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/call)).

The first argument of `call` is the value of `this` within the function, and then every argument following it will be passed to the function. So, we have to do:

    for(var i = 0; i < len; i++) {
        callback.call(thisArg, this[i], i, this)
    }

Your next question might be, what if `thisArg` is undefined? In which case, the value of `this` will become the global object, which is what it would become anyway if we'd done `callback(this[i], i, this)`, so that's actually the implementation we want.

And with that, we're done! Here's the entire code:

    Array.prototype.forEach = function(callback, thisArg) {
      if(typeof(callback) !== "function") {
        throw new TypeError(callback + " is not a function!");
      }
      var len = this.length;
      for(var i = 0; i < len; i++) {
        callback.call(thisArg, this[i], i, this)
      }
    }

As a quick test, try:

    var arr = [1,2,3];
    arr.forEach(function(item, index, th) {
      console.log(item, index, th);
    });

You should see this output:

    1 0 [ 1, 2, 3 ]
    2 1 [ 1, 2, 3 ]
    3 2 [ 1, 2, 3 ]

We can also test setting the value of `this` within the callback:

    arr.forEach(function(item, index, th) {
      console.log(this);
    }, {});

Here I set it to just an empty object, `{}`. In your console, you should see:

    {}
    {}
    {}

Which is just what we're after. Hopefully this has helped clear up any confusion over just what a polyfill is, and the general methodology behind going about writing one. As always, any questions or feedback, please leave a comment or grab me on Twitter. If you're looking for a more complete `forEach` polyfill, I suggest reading the [MDN Documentation](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach).
