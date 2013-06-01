---
layout: post
title: Scope and this in JavaScript
intro: "Something that a lot of people seem to get tripped up with scope in JavaScript but really it's not as bad as people tend to think. It's a similar story with the this variable and in this article I hope to clear this up for people who have struggled in the past. As always, if you have any queries about it, please leave a comment & I'll reply."
---
Today I want to talk a little about scope in JavaScript and the `this` variable. The idea of "scope" is that it's where certain functions or variables are accessible from in our code, & the context in which they exist & are executed in.

If you've ever seen someone do something like:

    function someFunc() {
      var _this = this;
      something.on("click", function() {
        console.log(_this);
      });
    };
  
And wondered what the `var _this=this;` is all about, hopefully this article should clear it all up. 

The first scope is __Global Scope__. This is very easy to define. If a variable or function is _global_, it can be got at from anywhere. In a browser, the global scope is the `window` object. So if in your code you simply have:

    var x = 9;
  
You're actually setting the property `window.x` to 9 (when working in a browser). You could type `window.x = 9;` if you like, but because it's the global object you don't have to. Properties on the global object can be accessed from anywhere in our code.

The only other scope we can have is __Local Scope__. JavaScript scopes at a function level. For example:

    function myFunc() {
      var x = 5;
    };
    console.log(x); //undefined
  
Since `x` was initialised within `myFunc()`, it is only accessible within `myFunc()`. 

__A word of Caution__

If you declare a variable & forget to use the `var` keyword, that variable is automatically made global. So this code would work:

    function myFunc() {
      x = 5;
    });
    console.log(x); //5
  
This is a __very bad idea__. It's considered bad practise to clutter the global scope. You should add as fewer properties as you possibly can to the global object. That's why you'll see libraries such as jQuery often do this:

    (function() {
      var jQuery = { /* all my methods go here */ };
      window.jQuery = jQuery.
    })();
  
Wrapping everything in a function which is then immediately invoked means all the variables within that function are bound to the _local scope_. At the very end you can then expose all your methods by binding the `jQuery` object to the `window`, the _global object_. Although I've simplified it hugely, this is in essence how the jQuery source works. If you want to learn more, [Paul Irish's "10 Things I learned from the jQuery Source"](http://paulirish.com/2010/10-things-i-learned-from-the-jquery-source/) is a highly recommended watch.

Because local scope works through functions, any functions defined within another have access to variables defined in the outer function:

    function outer() {
      var x = 5;
      function inner() {
        console.log(x); //5 
      }
      inner();
    }
  
But the `outer()` function doesn't have access to any variables declared within `inner()`:

    function outer() {
      var x = 5;
      function inner() {
        console.log(x); //5 
        var y = 10;
      }
      inner();
      console.log(y); //undefined
    }
  
That's pretty much all there is too it at a basic level. Things get a bit more complex once we take a look at the `this` keyword in JavaScript and how it works. I'm sure we've all come across this issue:

    $("myLink").on("click", function() {
      console.log(this); //points to myLink (as expected)
      $.ajax({
        //ajax set up
        success: function() {
          console.log(this); //points to the global object. Huh?
        }
      });
    });

`this` is a variable that is automatically set for you when a function is invoked. The value it's given depends on how a function is invoked. In JavaScript we have a few main ways of invoking functions. I wont talk about them all today, but just the three ways most people use them; either when a function is called as a method, or on it's own, or as an event handler. Depending on how a function is invoked, `this` is set differently:

    function foo() {
      console.log(this); //global object
    };
  
    myapp = {};
    myapp.foo = function() {
      console.log(this); //points to myapp object
    }
  
    var link = document.getElementById("myId");
    link.addEventListener("click", function() {
      console.log(this); //points to link
    }, false);
  
Those are all fairly obvious. The MDN has a [nice explanation](https://developer.mozilla.org/en/DOM/element.addEventListener) for the third & why this happens:

> It is often desirable to reference the element from which the event handler was fired, such as when using a generic handler for a series of similar elements. When attaching a function using addEventListener() the value of this is changed—note that the value of this is passed to a function from the caller.

So, now we know that, we are in a position to figure out why `var _this = this;` is required in the above code.

Doing `$("myLink").on("click", function() {})` means that when the element is clicked, the function is fired. But this function is bound as an event handler, so `this` is set to the reference to the DOM element `myLink`.  The success method you define within the Ajax request is _just a regular function_, and as such when it's invoked, `this` is set to the global object, as it is when any function that's not an event handler or an object method is.

The above is precisely why you'll see a lot of people doing `var _this = this` or `var that = this` or similar, to store the current value. It's also seen by many as what the correct value should be, but that debate is for another day.

    $("myLink").on("click", function() {
      console.log(this); //points to myLink (as expected)
      var _this = this;  //store reference
      $.ajax({
        //ajax set up
        success: function() {
          console.log(this); //points to the global object. Huh?
          console.log(_this); //better!
        }
      });
    });
  
There are ways in which we can invoke functions by explicitly defining what the value of `this` should be, but as this has already ended up as a fairly long article, I'll leave those for another day. If you have any questions, please do leave a comment & I will get back to you.
