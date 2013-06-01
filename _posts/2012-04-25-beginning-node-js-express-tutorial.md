---
layout: post
title: "Beginning Node.js"
---

Unless you've been living under a rock for the past 12 months or so, you've probably heard of [Node.js](http://nodejs.org). Simply put, Node is JavaScript on the server.

_Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices._ (taken from the Node.js homepage).

Node takes JavaScript onto the server, which means it's possible to write your entire application in JavaScript, using it for both the server side, handling requests & rendering views, and then on the front-end as we always have done. Whilst this isn't going to be an official tutorial series, I'll be writing a fair bit on Node in the future. 

Today we will look at installing Node & the package manager, NPM (really easy) and then the traditional "Hello World" tutorial. Once that's done we will take a look about other resources to make Node development easier, then in future tutorials we will use them. 

There's two ways to install Node. You can download the official package from the [website](http://nodejs.org/). Node runs on Linux, OS X & Windows. A word of warning: I am a Mac user myself and throughout this tutorial I will be using it exclusively. Although everything should work independent of OS, I wont be checking it myself.

If you're a Homebrew user (a package manager for OS X) you can get Node with `brew install node` and then NPM with: `curl http://npmjs.org/install.sh | sh`. NPM is Node's package manager, similar to how Rubygems manages Gems. Despite its relative infancy, there are a lot of very useful packages out there. It's worth having Node & NPM installed just for convenience. A large amount of JS resources are installed via NPM, including CoffeeScript & Grunt.js.

Now we've got it installed, lets do the "Hello World" example. Create a new directory & within that create `helloworld.js`. The idea here is that we will create a simple server, that when we visit a page will give us a plain text page back with just the line "Hello World" in. To do this we want to use the `http` package, which is installed by default. In Node to load in a module or package you've installed, we use `require`:

	var http = require('http');
	
Once we've done that we can then get at the methods within that module through the `http` variable.

The next step is to create a server, which is done through the `createServer` method, which takes a function as its argument. This function is passed in details on the request & the response:

	http.createServer(function(req, res) {
	});
	
Within this function all I wanted to do is return a plain text page with the line "Hello World". It's really easy:

	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('Hello World\n');
	
The first line writes the HTTP header, including the status & more importantly the content type, which in this instance is just plain text. I then end the response from the server with the line "Hello World". 

Finally, we need to tell the server to listen on a specific URL & port. We can chain this onto the `createServer` method:

	http.createServer(function(req, res) {}).listen(1337, '127.0.0.1');
	
Putting that all together, we get:
	
	var http = require('http');
	
	http.createServer(function(req, res) {
	  res.writeHead(200, {'Content-Type' : 'text/plain'});
	  res.end('Hello World\n');
	}).listen(1337, '127.0.0.1');
	
To run this, run `node helloworld.js ` in your terminal, and then visit `http://127.0.0.1:1337` in your browser. You should see:

![](http://cl.ly/3b2t2r1Z3y3o3W2u0x2O/Screen%20Shot%202012-04-25%20at%2000.03.12.png)

It's as easy as that. However, in most real world projects, people don't tend to just use Node. There's a few frameworks that have sprung up. The most popular at the moment is [Express JS](http://expressjs.com/). I will be covering Express in much more detail in future tutorials, however for now lets see how we'd achieve the "Hello World" demo in Express. Once you start writing an app that has a lot of dependencies, it's a good idea to keep track of them. In Rails you have a Gemfile, in Node & NPM you have `package.json`. Create this in the root directory and just give it a name & version:

	{
		"name" : "JS Playground Hello World",
		"version" : "0.0.1"
	}
	
To install express, in your terminal type `npm install express --save`. This will install express but also add it to your `package.json`. If you take a look at `package.json` now, you'll see:

	{
	  	"name": "JS Playground Hello World",
	    "version": "0.0.1",
	  	"dependencies": {
	    	"express": "~2.5.9"
	  	}
	}
	
This means if someone clones our project, for example, they can go into the directory & run `npm install`. NPM then looks at our `package.json` file and automatically installs the dependencies. This makes it easier all round. It's worth noting two things:

* NPM only updated our `package.json` because I passed it the `--save` flag. If I hadn't done that, it would not have touched the JSON file.
* If your `package.json` is invalid, NPM will NOT update it & also will not show any error messages, so be careful. This had me stuck for a while (in my opinion they would be better off showing an error message).

Right, so we now have Express installed, so lets take a look at that "Hello World". The first thing we do is require express. We can do this through `require()`. We can also immediately use Express' `createServer()` method to set it up. This returns an object with all the methods we need, so I save that to a variable `app`:

	var app = require('express').createServer();
	
Then we need to tell it that when the user visits the index page, to just send back "Hello World". This is very straight forward:

	app.get('/', function(req, res) {
		res.send("Hello World");
	});
	
This says that when we receive a `GET` request to `/` (the index / home page), to send back the text "Hello World". Easy as that. Finally, we need to give it a port to listen on:

	app.listen(3000);
	
Putting that together gives us:

	var app = require('express').createServer();
	app.get('/', function(req, res) {
	  res.send("Hello World");
	});
	
	app.listen(3000);
	
Run it again like before:

	node helloworld.js
	
And visit `http://127.0.0.1:3000`. You'll see exactly the same as last time. You can see hopefully that doing things with Express makes sense. It does a lot of the work for us. I'll be exploring Express in further tutorials.

With that it's time to round up this article. Hopefully this has served as a good introduction to Node.js & NPM. In future tutorials I'll be doing all sorts of things with Node & Express, as well as other things, including:

* Creating a Node module
* Using CoffeeScript with Node
* Unit testing Node applications

And a whole lot more. As always, if you have any questions, feedback or requests for future tutorials, please do leave a comment.
