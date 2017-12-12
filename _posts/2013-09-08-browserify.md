---
layout: post
title: Dependency Management with Browserify
intro: Browserify brings CommonJS style modules to the browser and enables you to load in files just like you would in NodeJS.
---

If you've been a long time reader of this blog you'll know that I'm a fan of RequireJS, and have written about it before. This past weekend I was doing a JS workshop and someone mentioned Browserify to me as a potential alternative. I'd not used it, so thought it was a good excuse to learn more and write up my experience.

[Browserify](https://github.com/substack/node-browserify) aims to bring Node's `require("module")` syntax to the browser. Node's syntax itself is taken from the [CommonJS Spec](http://wiki.commonjs.org/wiki/CommonJS), so in essence Browserify enables you to use your CommonJS style modules in the browser. It even allows you to require Node modules in the browser, although we won't look at that today. If you're comfortable requiring and defining modules in Node, Browserify should be easy to pick up. If not, don't worry, I'll explain how.

Defining a module is easy. Here I've created a file called `foo.js`, which exports just one method:

    module.exports = function(x) {
        console.log(x);
    };

The `module.exports` here will be picked up by Browserify, and tells it that when we require this file, to return this function.

Now let's write a file that uses our new module. I've called this `main.js`:

    var foo = require("./foo");
    foo("Hey");

The first line loads in the file `foo.js`, with the `./` at the beginning indicating it's in the same directory as `main.js`. Note that we can leave off the `.js` extension. That will return us the function we defined earlier, which we can then call by passing it an argument.

Right now, if we were to include `main.js` in our HTML, this wouldn't work. This is the downside of Browserify. To use it, we have to first generate a JS file using the Browserify command line tool, which you can install with npm:

    npm install -g browserify

Now run this command:

    browserify main.js > compiled.js

This instructs Browserify to start at `main.js`, and bundle up all our files and dependencies. Browserify will see that `main.js` requires `foo.js`, and pull that in for us. What we get is one JS file, `compiled.js`, which has everything we need. You can then add that into your HTML:

    <script src="compiled.js"></script>

Load it up in your browser, and you will see "Hey" logged to the screen.

Browserify's command line tool is clever, and is able to deal with just about anything you can throw about it. The [README](https://github.com/substack/node-browserify) goes through this in detail.

The benefit over RequireJS, at least for me, is that you don't need to worry about callbacks, or anything similar. In RequireJS, you have to do :

    require(["foo"], function(foo) {
        // foo is loaded
    });

But in Browserify we can just put `require` calls, and they are made synchronously.

The disadvantage is that you have to run Browsify after every single change. There are ways to automate this, of course, but it's still something you'll have to set up - there are plenty of things like this [Grunt plugin](https://github.com/jmreidy/grunt-browserify) that can help with the automation.

I advise you to have a look at Browserify - I admit that I didn't expect to like it or find it worthwhile, but having played with it a bit, I think I'll be using it in the future.
