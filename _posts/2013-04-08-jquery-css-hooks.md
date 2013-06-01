---
layout: post
title: "jQuery CSS Hooks"
---

Did you know that jQuery gives you a way to write your own custom CSS methods? I didn't until recently and I'd like to show you why they are useful in this short tutorial.

How many times have you wanted to do this:

	$("div").css("margin", "1px 2px 3px 4px");

But have to set each individual direction value separately? I know I have. Using CSS Hooks, we can easily add the above functionality to jQuery.

__A word of warning: CSS Hooks were added in jQuery 1.4.3, so if you're stuck on an older version (you really shouldn't be by now) then this wont work.__

Lets set up the wrapper for our new margin CSS hook. What we'll need to do is split the user's input into 4 values, one for each direction. First, I can set up an array containing the four directions. You'll see why this is important shortly:

	var directions = ["Top", "Right", "Bottom", "Left"];

Next, lets define our new "margin" hook. The hooks are stored as objects with two methods, `get` and `set`:

	$.cssHooks.margin = {
		get: function(elem) {
		},
		set: function(elem, value) {
		}
	};

Note that the `get` method does take more arguments, including the computed value of the specific CSS property it's being asked for. [The jQuery documentation discusses this in more detail](http://api.jquery.com/jQuery.cssHooks/).

Let's write the `set` method first. This take two arguments, the element to set the CSS properties on, and the value the user passed. In our case this will be a string of values, eg "1px 2px 3px 4px".

	set: function(elem, value) {
	  $.each(value.split(" "), function(i, val) {
	    elem.style["margin + directions[i]"] = val;
	  });
	}

Here we split the values at a space, and loop over them. We use the directions array so for each value the relevant direction property is set. So here we loop over, first setting `marginTop`, then `marginRight`, and so on.

The `get` method will essentially do the reverse, getting each of the individual values and then joining them together into a string:

	get: function(elem, value) {
      var res = [];
      $.each(directions, function(i, dir) {
        res.push($.css(elem, "margin" + dir));
      });
      return res.join(" ");
	}

We can use `$.css` to pull out a CSS setting. All this method does is grab the four individual values and add them to an array, which I then join at the end to return a string.

Now there's obviously some problems. In CSS we can do `margin: 5px 10px` to set top/bottom to 5px and left/right to 10px. Currently our implementation doesn't do this. Thankfully someone else has already done this. Brandon Aaron's [CSS Hooks project](https://github.com/brandonaaron/jquery-cssHooks) has a number of hooks, including a more feature-complete margin implementation.

As I said in the opening, this was a jQuery feature I'd managed to completely miss, and I bet I'm not the only one, hence writing this post. [My margin implementation is up on JSBin](http://jsbin.com/enixej/2/edit) if you'd like to have a play with it, and if you write any interesting CSS Hooks yourself, do let me know in the comments. I can think of a number of scenarios in which they could be very useful.
