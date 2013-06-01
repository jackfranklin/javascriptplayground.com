---
layout: post
title: "The JavaScript Module Pattern"
---

Lets say you've got a little library like this, that just increments a number:

	var jspy = {
	  count: 0,
	
	  incrementCount: function() {
	    this.count++;
	  },
	
	  decrementCount: function() {
	    this.count--;
	  },
	
	  getCount: function() {
	    return this.count;
	  }
	
	};
	
However, people using this library are able to do `jspy.count = 5` to manually adjust the value. Lets say for the purpose of this tutorial, that users should not be able to do that. In other languages you'd be able to define a private variable, but JavaScript doesn't explcitly have them. However, we are able to manipulate JavaScript to provide them to us, and that brings us on nicely to one of the most popular JavaScript design patterns, the __Module__ or __Modular__ pattern.

The solution to the above is:

	var jspy = (function() {
	  var _count = 0;
	  
	  var incrementCount = function() {
	    _count++;
	  }
	
	  var getCount = function() {
	    return _count;
	  }
	  return {
	    incrementCount: incrementCount,
	    getCount: getCount
	  };
	
	})();
	
Firstly I create the variable `_count`, with the underscore denoting that it's private. The underscore means _nothing programmatically_ in JavaScript's case, but it's a common notation used to denote private variables, and one I like to stick to. You can then see the functions that manipulate & return that variable.

However, you'll notice I've wrapped the entire library in a self-invoking anonymous function. This is a function that's executed immediately at runtime. The function runs, defines the variables & functions and then hits the `return {}` statement, telling this function what to return to the variable `jspy`, or in other words, what _to expose to the user_. I chose to expose the two functions but __not__ the `_count` variable, which means I can do this:

	jspy.incrementCount();
	jspy.getCount();
	
But if I attempt:

	jspy._count; //undefined

It returns `undefined`.

There are a couple of different approaches to the way I've done things above. Some people like to define the function in the return statement:

	var jspy = (function() {
		var _count = 0;

		return {
		  incrementCount: function() {
		    _count++;
		  },
		  getCount: function() {
		    return _count;
		  }
		};
	})();

And following on from that, Christian Heilmann coined the _Revealing Module Pattern_. His approach is to define all methods privately, that is, not in the `return` block, but expose them there instead, like so:

	var jspy = (function() {
	  var _count = 0;
	  var incrementCount = function() {
	    _count++;
	  };
	  var resetCount = function() {
	    _count = 0;
	  };
	  var getCount = function() {
	    return _count;
	  };
	  return {
	    add: incrementCount,
	    reset: resetCount,
	    get: getCount
	  };
	})();
	
The two advantages of this are:

* It's easier to see at a glace the methods that get exposed; when you're not defining all your methods within `return {}` it means it's one exposed function per line, making it easier to scan.
* You can expose methods via shorter names (eg `add`) but define them slightly more verbosely in your definition (eg `incrementCount`).

In future tutorials we'll be looking at other types of patterns and putting these to use in a real world context. For now if you're looking for further reading, I highly recommend [Addy Osmani's online book, JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/).
