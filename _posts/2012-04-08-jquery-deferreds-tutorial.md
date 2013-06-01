---
layout: post
title: "An introduction to jQuery Deferreds"
---

Prior to jQuery 1.5, Ajax requests could get a bit messy. You'd probably do something like this, if we were making a simple `get` request:

	$(function() {
	  $.get(
	    "content.txt",
	    function(resp) {
	      console.log("first code block");
	      console.log(resp);
	    }
	  );
	
	});
	
But this gives you a potential issue - what happens if this fails? What if you can't define the function to run in this code? These are issues before that have required a fair amount of work arounds but with 1.5 onwards we've got the [jQuery Deferred Object](http://api.jquery.com/category/deferred-object/). In this post I'll show you why this is so useful. All of the following code relies on __jQuery 1.5 or higher__.

jQuery Ajax calls now return the jQuery Deferred object I linked to above. The documentation is a little overwhelming & not entirely clear, so don't worry if a brief look at that leaves you confused. Simply put, Ajax calls now return a jQuery object containing what's known as a [promise](http://api.jquery.com/promise/):

> The .promise() method returns a dynamically generated Promise that is resolved once all actions of a certain type bound to the collection, queued or not, have ended.

In reality whilst working with basic Ajax calls, you don't need to worry about the exact specifications or inner workings. Continuing from the `get` example above, here's how we'd implement it using jQuery's `when()`, `then()` and `fail()` methods:

	$.when($.get("content.txt"))
	  .then(function(resp) {
	    console.log("third code block, then() call");
	    console.log(resp);
	  })
	  .fail(function(resp) {
	    console.log(resp);
	  });
	  
It can basically be read as:

	$.when(some ajax request).then(do this if it succeeds).fail(or do this if it fails)

The main feature of this is that `$.when()` can take multiple functions, and will then call the functions you pass to `.then()` once _all those functions_ have finished:

	$.when(fn1(), fn2()).then().fail()

You still might not be able to see the main advantage of this method yet, compared to just defining the methods within an object via `$.ajax()`. However, more importantly, we are able to _save Ajax calls to bind events later_:

	var xhrreq = $.get("content.txt");
	
We can then define `.success` and `.error` methods on this variable:

	xhrreq.success(function(resp) {
		console.log(resp);
	});
	
And:

	xhrreq.error(function(resp) {
	  console.log(resp);
	});
	

With the main advantage here, being that we can declare many functions to run:

	xhrreq.success(fn1);
	xhrreq.success(fn2);
	
Or, an even easier way:

	xhrreq.success(fn1, fn2);
	
So, to conclude, hopefully this article has shown you that deferreds are a much improved way to work with Ajax calls in jQuery. In the future I'll be doing follow up articles going into more depth.
