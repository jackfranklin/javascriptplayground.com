---
layout: post
title: Authoring JavaScript modules with ES6
intro: Learn how to be able to write your modules in ES6 before publishing them in a generic way to npm for others to consume.
redirect_from: "/blog/2016/10/authoring-modules-in-es6/"
---

**Update: this post was updated on 09/11/2015 to use Babel 6, rather than Babel 5.**

I've spoken and written previously about using tools like [jspm](http://jspm.io) to let you write web applications in ES6 and take care of the details, leaving you free to focus on writing your app and not the tooling around it. Today we're going to talk about how we can author and publish modules written in ES6, but doing so in a way that's generic enough to allow the consumer to use your module in Node or through a client side library like jspm, Webpack or Browserify.

The process isn't as complicated as you might imagine; thankfully we can offload most of the work to Babel, and the only requirement on our part is to run our ES6 through Babel before publishing the module to npm.

Let's get started by first creating a new project, and installing Babel as a developer dependency. We'll use Babel to convert our ES6 into ES5. This means that whilst we're able to embrace ES6 as the module author, if the person using our module is unable to, they don't have to. There's no extra burden on the end user to do extra work or configuration to use our module.

```
npm init
npm install --save-dev babel-cli
```

As of Babel 6 it's been split into two modules. babel-cli is for using Babel from the command line, and babel-core is for use through NodeJS. We're going to run Babel on the command line, so we'll install the CLI.

The module we're going to build is a tiny one that takes a GitHub username and uses the new [fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) to make a request to the GitHub API for a list of repositories that the user owns. Note that at the time of writing, the fetch API is only supported in Chrome, [but a polyfill exists](https://github.com/github/fetch). If you want a polyfill that works in both Node and in the browser, Matt Andrew's [Isomorphic Fetch](https://github.com/matthew-andrews/isomorphic-fetch) is your best bet.

It's up to you if you want to include the polyfill in the module, or suggest to users that they use it. Personally I prefer to let the end user decide, they might not need a polyfill, or have a particular favourite, and I don't want to force that on them.

Because we'll be converting our source code into code that we then publish, I like to create a directory, typically named `src`, that holds our source code. Let's create `src/githubby.js`, that exports the function I mentioned previously:

```js
export function getReposForUser(username) {
  let url = `https://api.github.com/users/${username}/repos`;

  return fetch(url).then((response) => response.json());
}
```

This code makes use of a few ES6 features, including ES6 modules, block scoping, template literals and arrow functions. This code won't run in many environments right now, and that makes our module pretty useless. We can use Babel's command line tool to convert this code:

```
babel -d lib src/
```

This tells Babel to take every JavaScript file in the `src` directory, and output a corresponding compiled file into `lib`. However, as of Babel 6, this won't do anything by default. Babel doesn't provide any transforms by default, you have to tell it what transforms you want it to perform. Luckily for us Babel also provides a number of presets to quickly configure things. One such preset is `babel-preset-es2015`, which configures Babel 6 to transform our code into ECMAScript 5 code. First, install the preset:

```
npm install --save-dev babel-preset-es2015
```

And then create a `.babelrc` file to tell Babel to use that preset:

```js
{
  "presets": ["es2015"]
}
```

Now when we run Babel 6, our code will be transformed as we expect. If we take a look at `lib/githubby.js`, you'll see a file that looks similar to the below:

```js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReposForUser = getReposForUser;
function getReposForUser(username) {
  var url = "https://api.github.com/users/" + username + "/repos";

  return fetch(url).then(function (response) {
    return response.json();
  });
}
```

You can see that Babel has converted our code into JavaScript that is widely supported across browsers and environments like NodeJS.

The final step is to set up our module such that when we publish it to npm, we first rerun Babel to generate the files in the `lib` directory. We also need to tell npm which file it should load when our module is imported by another.

Firstly, we can add an npm script called `prepublish` in our `package.json` file:

```js
"scripts": {
  "prepublish": "./node_modules/.bin/babel -d lib src/"
},
```

There's a very good reason that we call this script `prepublish`. When we want to push our module onto npm, we'll run `npm publish`. This is a command built into npm. When we run `npm publish`, it will first look for a script called `prepublish`, and run that if it exists.

To tell npm which file it should load by default, we need to edit the `main` property in our `package.json` file to point to our generated `lib/githubby.js` file:

```js
"main": "lib/githubby.js",
```

With both of those set up we can now run `npm publish` to publish our module for all to use:

```
jack/jsplayground-example > npm publish

> jsplayground-example@1.0.0 prepublish /Users/jackfranklin/git/jsplayground-example
> babel -d lib src/

src/githubby.js -> lib/githubby.js
+ jsplayground-example@1.0.0
```

Now we have a module that we've authored entirely in ES6 that is published in a way that makes it usable to as many different consumers as possible. Nothing in our module is specific to the browser or specific to Node, and a person using this module could be using it in the client or on the server, and it will work just as well on both. In a future article I'll look at the different ways we can consume this module. If you'd like to grab the code and check out the module for yourself, [you can check the example repository on GitHub](https://github.com/jackfranklin/authoring-es6-module-example).

