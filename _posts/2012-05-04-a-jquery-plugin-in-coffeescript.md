---
layout: post
title: "A jQuery Plugin in CoffeeScript"
---

So [last week](http://javascriptplayground.com/blog/2012/04/a-jquery-plugin-with-grunt-qunit) I showed you how to write a basic jQuery plugin and today I want to take that plugin & convert it into CoffeeScript.

The first thing to do is open up that project again, and within `src`, create `jquery.pullquote-coffee.coffee`. Then head into `tests/jquery.pullquote.html` and change the line that includes the plugin to reference `../src/jquery.pullquote-coffee.js`. I wont be using a browser at all to change this plugin over to CoffeeScript. I'll be using our QUnit tests.

For those who have not heard of [CoffeeScript](http://www.coffeescript), it's a language created by Jeremy Ashkenas that gives us some nice syntax, abstracts common JavaScript problems away & makes it quicker to write JavaScript. The way it works is simple, you write CoffeeScript, compile it into JavaScript, and then include that file like you would any other JS file.

Seeing as CoffeeScript is pretty easy to pick up, I'll cover features as I go. We'll only look at the basics today, with more to come in the future.

The first thing you need to do is decide how you'll compile it. I like to use [LiveReload](http://www.livereload.com), which is a Mac (and soon to be Windows) app that compiles automatically for you, if I have a lot of different compilations going on (perhaps CoffeeScript, SASS & HAML, for example).

The other option though is to install it through the terminal, done using Node & NPM. If you've not got those install, [I wrote about how to install them last week](http://javascriptplayground.com/blog/2012/04/beginning-node-js-express-tutorial) so check that out & then come back here. Install CoffeeScript with:

	npm install -g coffee-script
	
`-g` installs CoffeeScript globally, so it's available from the command line. You can then compile a JS file with:

	coffee --compile jquery.pullquote-coffee.coffee
	
However this gets boring quickly, running this every time you want to compile it. You can use `watch` to make CoffeeScript compile everytime you save your Coffee file:

	coffe --compile --watch jquery.pullquote-coffee.coffee
	
That's how I'll be doing so today, however, there's one more thing to consider. By default, CoffeeScript wraps all your code within:

	(function() {	
		//your code here
	}).call(this);

Usually this is useful, it keeps our code contained & prevents us accidentally poluting the global namespace. In this instance however, we want to wrap our plugin within our own immediately invoked function:

	(function($) {
	
	})(jQuery);
	
We can tell CoffeeScript to not wrap our code in that function by passing the `--bare` option. So my final command for watching & compiling my coffee file is:

	coffee --compile --watch --bare jquery.pullquote-coffee.coffee  
	
So, now we've got the compiling working, lets write the code. Firstly, load up the `.coffee` file. Before we write code, run the QUnit tests in the terminal with `grunt qunit`. You should see them all fail. Now it's time to make them all pass by writing our implementation in CoffeeScript. The first thing we need to replicate is the wrapping function:

	(function($) {
	
	})(jQuery);
	
This looks like so in CoffeeScript:

	( ($) ->
	
	) jQuery
	
Wow, what just happened there? 

1. CoffeeScript replaces the `function` keyword with just `->`.
2. Instead of passing in the variables after the `function` keyword, in CoffeeScript you pass them in before. For example, something like:

		function(foo) {
	
		};
	
	Becomes:

		(foo) ->
		
3. There's also no need for braces in CoffeeScript, the language works on indentation. So where you would usually wrap some code in braces, in CoffeeScript you just indent by a tab. This can be a tab, 2 spaces, 4 spaces, whatever your preference. As long as you're consistent, CoffeeScript can deal with it.

	You also don't need to wrap function arguments in brackets when you call it. So something like:
		
		someFunc("hey", 2, 5);
		
	Becomes:
	
		someFunc "hey", 2, 5
		
	If you want to add in brackets, you can. Sometimes I do it if a function takes lots of arguments, or if I'm calling a function and passing it in the result of another function. You also need to use brackets when you want to call a function or access a property on the result of a function.
	
4. You don't need to use semi colons.
	

Now we've got the wrapping function sorted, it's time to declare our plugin function. This:

	$.fn.pullQuote = function(opts) {}
	
Becomes:

	$.fn.pullQuote = (opts) ->
	
And the next line

	opts = $.extend({}, $.fn.pullQuote.options, opts);
	
Stays almost identical, I just choose to drop the brackets:

	opts = $.extend {}, $.fn.pullQuote.options, opts
	
The next large block of code to convert starts with `return this.each(function() {`. In CoffeeScript, `return` is added automatically for you, much like Ruby, if you've ever used that. So at the bottom of a function, instead of adding:

	return foo;
	
I can just do:

	foo

Some people find this not so clear and if you don't, you're fine to add in the `return` keyword, it's again up to you. Obviously if you need to return from a function before the end, you still can:

	foo = ->
		if x
			return y
			
		z
		
That function would return `y` if `x` exists, else it will return `z`. CoffeeScript is pretty clever about knowing when you want a return statement, and when you don't.
		
So, back to our plugin. We've got:

	return this.each(function() {
	
But in CoffeeScript, we can do:

	this.each ->

As this is the last block of code in our function, CoffeeScript knows to return it for us. Within the loop we have:
	
	var elem = $(this),
	    text = elem.text(),
	    newElem = $("<" + opts.outputElem + "/>", {
	      "class": opts.outputClass,
	      text: text
	    }).insertAfter(opts.insertAfter);
	    
Another easy CoffeeScript rule, `var` is not needed. If you write:

	x = 2
	
In CoffeeScript, the compiled JS will be:

	var x;
	x = 2;
	
Note the declaration will be hoisted to the top of its containing scope. In practise this is rarely an issue, but it's something to note. If you have:

	x = 2
	someFunc()
	y = 5
	
That will compile to:

	var x, y;
	x = 2;
	someFunc():
	y = 5;
	
So, in our plugin we've got `var elem = $(this)`, I can replace this with:

	elem = $(this)
	
I could also get rid of the brackets, but when using jQuery I tend to leave them in. For me it makes things clearer and I like to do it with jQuery because often you'll end up chaining things onto `$(this)`, so adding brackets in first will maybe save time later.

Now, previously we had:

	var elem = $(this),
	  text = elem.text(),
	  
(Note the commas), but because CoffeeScript sorts out `var` for us, we don't need the commas and can just declare a variable on each new line:
	
	this.each ->
	  elem = $(this)
	  text = elem.text()
	  
	  
The next block we have to convert is:

	newElem = $("<" + opts.outputElem + "/>", {
      "class": opts.outputClass,
      text: text
    }).insertAfter(opts.insertAfter);
    
Rather than do this one line at a time, I'll show you the fully converted code & then walk through it:

	newElem = $("<#{opts.outputElem}/>",
	  class: opts.outputClass
	  text: text
	).insertAfter opts.insertAfter

Going line by line:

1. CoffeeScript has a rather neat way of letting us put variables in the middle of strings. If you've ever written Ruby you'll recognise this, it's very much the same syntax. Any `#{}` that's within double quotes will be evaluated.
	So:
	
		str = "Two plus two is #{2+2}"
		
	Will give:
	
		str = "Two plus two is " + 2+2
		
2. Next, I pass in an object as the second argument. Except I don't have to use braces here, I can just indent by one tab. Also, I don't have to put quotes around the word "class". CoffeeScript sees that I've used a reserved word, and will automatically add quotes around it for me. How awesome is that? I also don't have to add a comma after the first property in my object, CoffeeScript does that for me too. 

3. Finally, I call `insertAfter` and pass in the correct option. That bit is pretty straight forward, I've just dropped the brackets.

The very last bit to convert is:

	$.fn.pullQuote.options = {
	  outputClass: "pullquote",
	  outputElem: "blockquote",
	  insertAfter: "elem"
	};
	
And that's written like so:
	
	$.fn.pullQuote.options =
	  outputClass: "pullquote"
	  outputElem: "blockquote"
	  insertAfter: "elem"
	  
No braces, just indent in, and no commas needed either. Putting that all together, we have:

	( ($) ->
	
	  $.fn.pullQuote = (opts) ->
	    opts = $.extend {}, $.fn.pullQuote.options, opts
	
	    this.each ->
	      elem = $(this)
	      text = elem.text()
	      newElem = $("<#{opts.outputElem}/>",
	        class: opts.outputClass
	        text: text
	      ).insertAfter opts.insertAfter
	
	
	  $.fn.pullQuote.options =
	    outputClass: "pullquote"
	    outputElem: "blockquote"
	    insertAfter: "elem"
	) jQuery
	
And now running our QUnit tests will show 10 passes, out of 10. Job well done. 

In this rather quick paced tutorial, hopefully this has given you a glimse into why so many people are using CoffeeScript, and some of the advantages it will bring. In the future I'll look more in depth with CoffeeScript, and also show how you can use it when writing Node applications. As always, if you have a question, please do leave a comment.
