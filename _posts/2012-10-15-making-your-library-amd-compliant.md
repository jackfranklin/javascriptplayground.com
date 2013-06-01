---
layout: post
title: "Making your library AMD compliant"
---

Previously on this blog I've written about an AMD approach with [Require.js](http://javascriptplayground.com/blog/2012/07/requirejs-amd-tutorial-introduction) and about package management with [Jam JS](http://javascriptplayground.com/blog/2012/07/package-management-with-jam-js). Jam uses Require.js so what I thought would be a nice way to tie these two posts together would be to write on how to make your JS library AMD compliant and how to publish it with Jam, for use in other projects.

The project I'm using is actually written in CoffeeScript, but it's so similar to JavaScript in this instance that it shouldn't be an issue. I've also included the same code in JavaScript, if CoffeeScript isn't your thing.

I discussed how to define a module in the previous RequireJS tutorial linked above, so if you're not sure how to do things, please read that and then return here. The way to define something is simple - check if `window.define` exists, and if it does, use it to define our module. To define a module we need to pass it a function that simply returns what we want a user of our library to access. Sometimes that's just one method, or it might be an object of multiple methods.

In my case, using my little [Responsive Images](https://github.com/jackfranklin/responsiveImages) script, I just needed to expose the function `responsiveImage`, which I had already attached onto the window object at this stage. In CoffeeScript, it's written like so:

	#expose globally
	window.responsiveImage = responsiveImages
	
	# support AMD
	if typeof window.define is "function" && window.define.amd
	    window.define "responsiveImages", [], -> window.responsiveImage
	    
	    
If I were to write that in JavaScript, it would be:

	window.responsiveImage = responsiveImages;
	
	if (typeof window.define === "function" && window.define.amd) {
	  window.define("responsiveImages", [], function() {
	    return window.responsiveImage;
	  });
	}
	
Note that I use `window.define` rather than `define` because all my code is wrapped within an anonymous function, so I don't have access to the global scope through `this`.

The next thing to do is to create a `package.json` file so Jam knows about our package and how to run it. For my project, it looks like this:

	{
	  "name": "responsiveImages",
	  "version": "0.0.2",
	  "description": "A quick script to provide a way of changing which image to use based on window dimensions.",
	  "main": "responsiveimages.js",
	  "repositories": [
	    {
	    "type": "git",
	    "url": "https://github.com/jackfranklin/responsiveImages.git"
	  }
	  ],
	  "github": "https://github.com/jackfranklin/responsiveImages"
	}
	
The only line there that isn't immediately obvious is the one declaring `main`. By default Jam will look for a file `main.js`, but if yours isn't called that you can tell it so in the JSON file. There's a lot more options you can set - [they are documented well on the Jam site](http://jamjs.org/docs#Package_json). 

Now it's time to publish. Head to the [Jam site](http://jamjs.org/) and sign up. Then head into your library's directory and run:

	jam publish
	
If all goes well, you will see output similar to:

	-> jam publish
	Please provide credentials for: http://jamjs.org/repository
	Username: jackfranklin
	Password: 
	creating /Users/JackFranklin/.jam/cache/responsiveImages/0.0.2/responsiveImages-0.0.2.tar.gz
	extracting /Users/JackFranklin/.jam/cache/responsiveImages/0.0.2/responsiveImages-0.0.2.tar.gz
	OK
	
Now lets check this. Head into a project where you want to use the library (preferably this should be one which already uses Jam for package management) and run:

	jam install responsiveImages
	
Changing the package name to yours. You'll see output that should include something like

	installing responsiveImages@0.0.1 
	
Once that's done, try it out. Head into your main JS file and change the `require` call to include your new package. Remember that the package return is passed into the function as a variable, so add that in too:

	require(['jquery', 'responsiveImages'], function ($, RI) {});
	
And now you should be able to use your library! As a test, I ran a simple `console.log(RI)` and made sure it logged the function I return. If you want to upgrade your package, it's generally a 3 step process:

1. Make your changes and commit them.
2. Boost the version number in your `package.json`
3. Run `jam publish` again.

If you're working on a lot of projects that use a lot of similar code, I highly recommend extracting them out into small AMD modules that can then be managed with a tool like Jam. I've been doing it recently and it really has made things a lot nicer when it comes to JS library versioning, upgrading and so on.
