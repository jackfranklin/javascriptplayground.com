---
layout: post
title: "A jQuery Plugin with Grunt &amp; QUnit"
---

Today we're going to take a look at writing a jQuery plugin. There's a number of different ways to go about structuring jQuery plugins & hence a lot of tutorials differ. I'll show you how I  would do it but also show examples of how others would do it & link you to alternative views. Along with developing  the plugin, we will test it with unit tests through QUnit (my new favourite thing [which I covered a couple of weeks back](http://javascriptplayground.com/blog/2012/04/javascript-testing-qunit-1)) and build it all with Grunt.js, [which I covered last week](http://javascriptplayground.com/blog/2012/04/grunt-js-command-line-tutorial). I'll be presuming some basic knowledge of jQuery, QUnit & Grunt; if you're not familiar with either Grunt or QUnit, those links above to previous tutorials should get you going.

To write this tutorial, I wanted to come up with a proper idea for a plugin and I decided to take a look at the first jQuery plugin I ever wrote, which was called "jQuote". This plugin takes some text & creates a quote from it as a `blockquote` element, the idea being then it can be styled as a pull quote, much like you see in magazines. This plugin was written as my first and consequently I don't like it. Today I'm going to show you how I'd go about rewriting it, more effectively and with unit tests. In fact, I won't even test it in the browser until the very end, as all the development will be test driven. 

So, the first thing I'm going to do is set up a new directory for my plugin, which this time round is going to be called jQuery PullQuote. I create a Git repository, and then run `grunt init:jquery` to set up a new jQuery plugin project. Grunt asks me questions about my project & after answering them I'm left with a project set up. I then add them all to Git and here's what Grunt's made for me:
	
	create mode 100644 LICENSE-GPL
	create mode 100644 LICENSE-MIT
	create mode 100644 README.md
	create mode 100644 grunt.js
	create mode 100644 libs/jquery/jquery.js
	create mode 100644 libs/qunit/qunit.css
	create mode 100644 libs/qunit/qunit.js
	create mode 100644 package.json
	create mode 100644 src/jquery.pullquote.js
	create mode 100644 test/jquery.pullquote.html
	create mode 100644 test/jquery.pullquote_test.js
	
You can see it's given me everything I need. Making a jQuery plugin means we should use QUnit, as QUnit is the testing framework of choice for jQuery. Lets head into `src/jquery.pullquote.js` and get coding. Grunt gives us a bit of a framework:

	/*
	 * jquery.pullquote
	 * https://github.com/jackfranklin/jquery.pullquote
	 *
	 * Copyright (c) 2012 Jack Franklin
	 * Licensed under the MIT, GPL licenses.
	 */
	
	(function($) {
	
	  // Collection method.
	  $.fn.awesome = function() {
	    return this.each(function() {
	      $(this).html('awesome');
	    });
	  };
	
	  // Static method.
	  $.awesome = function() {
	    return 'awesome';
	  };
	
	  // Custom selector.
	  $.expr[':'].awesome = function(elem) {
	    return elem.textContent.indexOf('awesome') >= 0;
	  };
	
	}(jQuery));
	
I'm going to be using the first approach:

	$.fn.pullQuote = function(opts) {
	  opts = $.extend({}, $.fn.pullQuote.options, opts);
	};
	
	
	$.fn.pullQuote.options = {
	  outputClass: "pullquote",
	  outputElem: "blockquote",
	  insertAfter: "elem"
	};
	

In one step there a fair amount has happened, so lets take a moment to have a look. I've set up my function as `$.fn.pullQuote` which means it gets called on a jQuery collection, for example: `$("span").pullQuote();`. You can also pass in an optional object of options. The line:

	opts = $.extend({}, $.fn.pullQuote.options, opts);
	
Takes anything I have in `opts`, overrides that property in `$.fn.pullQuote.options` and stores the formed object into `opts`, which overrides the `opts` passed into the function.

The reasoning for doing this is so people can override our defaults on a global level. If this plugin is being used 3-4 times, it's quicker to change `$.fn.pullQuote.options` than pass it into `$("span").pullQuote()` every time. However, I've written this code, but not tested it! Lets quickly write some tests:

	test("defaults", function() {
	  ok($.fn.pullQuote.options, "options set up correctly");
	  equal($.fn.pullQuote.options.insertAfter, "elem", "default global options are set");
	  $.fn.pullQuote.options.insertAfter = "test";
	  equal($.fn.pullQuote.options.insertAfter, "test", "can change the defaults globally");
	});
	
You can run them through grunt with `grunt qunit`. Alternatively, you can run `grunt watch` and it will run the tests for you when save a file. Those tests all pass, so we're on the right track.

From now on, I'll write the tests first, as I should. Because our plugin interacts with DOM elements, I need to create some test HTML for us to work with. QUnit lets us put this in a `div` with an id of `qunit-fixture`. We can then get at this HTML in our tests, so this is a useful way to test plugins that interact with & manipulate the DOM. I'm going to create `span` with some text. The plugin should take this text and add a new quote after the `h2`.

	<div id="qunit-fixture">
	  <p>this is some text <span>with a totally awesome quote</span></p>
	  <div><h2>Quote</h2></div>
	</div>
	
The first thing I want to ensure is that my plugin is chainable. People should be able to do `$("span").pullQuote().fadeOut().addClass("foo")`, as they can with all jQuery methods. Here's the test I use:

	test("chainable", function() {
	  ok($("p span").pullQuote().addClass("testing"), "can be chained");
	  equal($("p span").attr("class"), "testing", "class was added correctly from chaining");
	});
	
The logic here is to call PullQuote, then add a class, and then check that the element was indeed given that. Passing this test is easy. After our `opts = $.extend();` line, add in:

	return this.each(function() {
	});
	
`this` refers to the collection the plugin was called on as a jQuery object, so by returning it we're returning the jQuery object which means we can chain. Within the `each` is where we'll add the code to make it work.

So now we've got the basics out the way, I want to write the tests in their entirity for the functionality. I've set up my test HTML in `#qunit-fixture` so I'll use that for the tests. I want to take the text within the `span` and create a new element after the `h2`.

	test("functionality", function() {
	  $("p span").pullQuote({
	    insertAfter: "div h2"
	  });
	  ok($("div blockquote").length, "the blockquote has been created");
	  equal($("div blockquote").text(), "with a totally awesome quote", "it gets the right text");
	  ok($("div blockquote").hasClass("pullquote"), "applies class correctly");
	
	});

This checks that `div blockquote` is now valid, because after `pullQuote` is called it should create that for us. It then makes sure the text matches, and that it has the class set in the options. I also want to write tests to check the defaults can be overwritten fine:

	test("changing defaults", function() {
	  $("p span").pullQuote({
	    insertAfter: "div h2",
	    outputClass: "testQuote",
	    outputElem: "p"
	  });
	  ok($("div p.testQuote").length, "the blockquote has been created");
	  equal($("div p.testQuote").text(), "with a totally awesome quote", "it gets the right text");
	});
	
That does much the same as the prior tests, but this time overriding the defaults & then checking the plugin took them into account. The actual code to implement this is really simple:

	return this.each(function() {
	    var elem = $(this),
	        text = elem.text(),
	        newElem = $("<" + opts.outputElem + "/>", {
	          "class": opts.outputClass,
	          text: text
	        }).insertAfter(opts.insertAfter);
	  });
	  
Line by line, we:

1. Wrap the current item in a jQuery object,
2. Get the text & store it.
3. Create a new element of the type the option is set as,
4. Add the class set in options & the text we got earlier,
5. Insert it after whatever selector is in `insertAfter`.

Running the tests now should give you a full passing suite of 10 assertions.

Now this plugin is very basic, and there's a lot more I want to expand on, but for now that will do, and I will revist this in the future. For now, lets imagine I want to release this onto Github. To do this, we'll harness the power of Grunt. Run `grunt` in the command line. This will execute grunt's default task, which by default will:

1. Run the code through JSLint
2. Run the test suite
3. Concatenate all your JS src files into one.
4. Minify them.

If at any stage there are errors (say your tests fail), it will stop. It's now created the files `dist/jquery.pullquote.js` and `dist.jquery.pullquote.min.js` for us. Just like that. After that all I have to do is commit them, and then [push them to Github](https://github.com/jackfranklin/jquery.pullquote).

I hope this article has shown you what I think is a good workflow for developing a jQuery Plugin, using Grunt to do a lot of the hard work for us (I absolutely love using Grunt) and writing Unit Tests. The functionality implemented here is very, very basic but I wanted this to serve as an introduction, I've got tutorials planned soon that attempt to implement much more complicated functionality. As always, please leave a comment & I will get back to you.
