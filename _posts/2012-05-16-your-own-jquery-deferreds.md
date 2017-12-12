---
layout: post
title: "Your own jQuery Deferreds"
---

One of the first and most well received posts on the JavaScript Playground [introduced jQuery Deferreds](http://javascriptplayground.com/blog/2012/04/jquery-deferreds-tutorial), a new feature in jQuery 1.5 to enable us to manage Ajax requests much easier. Today I want to build on that post by showing you how you can construct your own deferreds, enabling you to run callbacks much more efficiently on any piece of code.

Before Deferreds, if you wanted to run some code once you'd done something trivial, such as fading in a `div`, you'd do:

    $("#myDiv").fadeIn(1000, function() {
    	//callback
    });

That's great, but what if later down in your code you want to see if this div has indeed been faded in? One way round it might be:

    var divFadedIn = false;
    $("#myDiv").fadeIn(1000, function() {
    	divFadedIn  = true;
    	//callback
    });

But that's messy and you end up with a lot of variables you'd much rather avoid and then you get lots of irritating `if(divFadedIn)` which really irks me.

That's where Deferreds come in. In the past post I showed how they work with Ajax calls, but you can also integrate them into your own functions. Say we have a function fade in a div:

    var showDiv = function() {
    	$("#fadeIn").fadeIn(1000);
    });

Integrating Deferreds into this is easy:

1. Create a new `$.Deferred()` object.
2. Resolve the deferred when the code has been executed.
3. Return the `promise()`.

So the above code now looks like:

    var showDiv = function() {
    	var def = $.Deferred();
    	$("#fadeIn").fadeIn(1000, def.resolve);
    	return def.promise();
    });

We can then check this has executed like so:

    $.when(showDiv()).then(function() {
    	console.log("div faded in");
    });

Which is a pattern you'll recognise from the previous post. It's exactly how we checked an Ajax request was done.

We can go further though, by allowing our Deferred function to return data. The only change here is to call the method `def.resolve()`, and pass it an object:

    var showDiv = function() {
    	var def = $.Deferred();
    	$("#fadeIn").fadeIn(1000, function() {
    		def.resolve({
    			elem: this.id
    		});
    	});
    	return def.promise();
    });

We can then get at this data easily:

    $.when(showDiv()).then(function(resp) {
    	console.log("div was faded in with response ", resp);
    });

Remember, `$.when` can accept multiple arguments, so if you had 3-4 functions all along these lines, you could do:

    $.when(showDiv(), hideOtherDiv(), foo(), bar()).then();

And if you need to check the state of the div later, you can save the promise to a variable to check:

        var divFaded = showDiv();

Although this doesn't get rid of my complaint of having to create a few variables, this does tidy it up a bit; we don't have to manually set values. It's also rare in practice that you'll need to do this, at least I've found that for me.
There's a lot of power here to be used and there's a lot more Deferreds are capable of. In a future post, to be the final part of this 3-part series, I'll look at just what else we can use Deferreds for, and some common errors people make when using them.s
