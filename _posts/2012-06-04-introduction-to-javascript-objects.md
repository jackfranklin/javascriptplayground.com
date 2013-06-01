---
layout: post
title: "Introduction to JavaScript Objects"
---

Today I'd like to talk a little bit about Objects in JavaScript. When I first started using JavaScript (my first experience of it was through jQuery), I was initially confused with this whole idea of passing in objects to functions, in particular to jQuery functions like `animate()` or `css()`:

	$(foo).css({
		"border" : "1px solid black",
		"color"  : "red"
	});
	
This always confused me, before I had a solid grasp on pure JavaScripts & in particular JavaScript objects. If you're writing lots of JavaScript, objects are going to be something you use frequently so it's important as a beginner you make sure you've got a firm understanding of them.

So, firstly, how do we create an object? We can do it two ways:

	var x = new Object();
	var y = {};
	
Both of these mean exactly the same thing & both simply instantiate an empty object. In reality, the vast majority of developers use the second method - it's a lot shorter whilst still being clear as to what it does. 

As a side note, this is identical to how we might create new arrays, either through `var z = new Array();` or through simply `var z = []`.

Now we have this object, we can define properties (or keys) and values. This can be done in a number of ways. You can create an empty object & then add properties:

	var x = {};
	x.foo = "bar";
	x["baz"] = 123;
	
You'll notice the two ways of assigning properties. You can either use the dot notation or the square brackets. The differences between the two are easily shown through this code snippet:

	//x = some object
	var bar = "foo"
	x.bar //looks for "bar" property in object "x"
	x[bar] //looks for "foo" property in object "x"
	
The first method will look for the property named whatever you place after the dot, whilst the square brackets will evaluate what's inside. Hence, the square bracket notation is useful when you have the property you want to access stored within a variable, whilst if you know which property you want to get at, you'll tend to use the dot notation.

However, you don't have to create an empty object first, you can create an object & define properties in one swoop:

	var x = {
		foo: "bar",
		baz: 123	
	}
	
You do not need to put the properties of an object in quotes when declaring them __except__ when using a reserved word in JavaScript. For example, you couldn't do:

	var x = {
		class: 123
	}
	
If you wish to store a property that is also a reserved word, you need to quote it when declaring it:

	var x = {
		"class": 123
	}

Note that from ECMAScript 5, reserved words _can_ be used as properties without needing quotes, but that is only currently implemented in IE9, FF 3.5+ and Chrome 7+. If you wish to support prior versions of these browsers (and others, like Safari), quote your reserved word properties or, preferably, just don't use them.

When declaring properties like this, note the use of commas. After the value for each _but the last_ property, you need to add a comma. Leaving a comma on the last one, or missing one out, will result in errors. That's why you'll sometimes see people declare objects like this:

	var x = {
		  bar: 123
		, foo: 456
		, baz: "abc"
	}
	
Whilst I'm not a fan, that method does make it much easier to see if you've missed a comma or put one where you don't need it. I personally prefer the more common approach that I use throughout this post, but if you prefer the other method, that's fine. As usual, it's down to personal preference.

To iterate over an object, we can use `for…in`:

	var x = {
		foo: "bar",
		baz: 123	
	}
	for (prop in x) {
		console.log(prop, "=", x[prop]);
	}
	
Which would output:

	foo=bar
	baz=123
	
Of course, properties of an object can contain functions (although functions inside an object are actually methods), too:

	var x = {
		add: function(a, b) {
				return a+b;
			}
	};
	
Which is then called as `x.add(1,2)` as you'd expect. A good thing to know is when a method is invoked, its scope is set to the object. For example:

	var x = {
		add: function() { console.log(this); },
		bar: 123
	}
	x.add();
	
Logs:

	{ add: [Function], bar: 123 }

	
And of course, objects can have objects in them:

	var x = {
		y: {
			add: function(a,b) { return a+b; },
			self: function() { console.log(this); }
		},
		bar: "foo"
	}

In this instance, `x.y.self()` would log `{ add: [Function], self: [Function] }`. Just to illustrate, I could call that method using the square bracket notation:

	x["y"]["self"]();
	
The reason you'll often see APIs of libraries take an object as an input to a function is that it's much easier than having multiple parameters and also allows you to only define those values you want to change. A jQuery plugin might have 5 options, with 5 defaults set. If you wanted to change just one of them but couldn't pass an object into the plugin, you would probably have to pass in every value, even those you don't want to change:

	$(foo).plugin("defaultVal", "defaultVal", "changedVal", "defaultVal");

It's also unclear what each of those options are, whereas if you can pass in an object:

	$(foo).plugin({
		someProp: "changedVal"
	});

The advantage is twofold: it's clear what option you're changing, and you don't have to specify the defaults again. All we do here is pass an object directly into a function. You could, if you wanted, create it first:

	var opts = {
		someProp: "changedVal"
	}
	$(foo).plugin(opts);
	
With that it's time to bring this tutorial to a close. There is a lot more to cover, but this is all planned in an article next week titled "Object Oriented Programming in JavaScript", which will pick up where this left off & go much further, to hopefully show some real life usage of objects & how powerful they can be. As always, if you have any questions please do leave a comment & I will get back to you. The next article will be on Wednesday, June 6th where I'll be demonstrating the use of Sockets with Node.js.
