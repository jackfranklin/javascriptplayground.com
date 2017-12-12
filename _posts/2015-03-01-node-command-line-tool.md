---
layout: post
title: Writing Command Line Tools with Node
intro: In this post I'll show you how to write a basic command line tool using Node.js
---

Back in August 2012 I wrote a post on [building a command line tool in NodeJS](/blog/2012/08/writing-a-command-line-node-tool/). That post is now over two years old and plenty has changed, hence I thought it worth writing a new post building the same tool, showing how I'd do it now.

We're going to build the same tool, one that's used to search a directory for files that match a given string. This is not a very useful plugin, but will let me demonstrate the basics of building a CLI in NodeJS.

## Creating the Project

First things first: let's create a new project. Create a directory for the project, enter it and run `npm init` to initialise the new project with a `package.json` file. Answer the prompts if you wish, or just hit enter a bunch of times to get a template `package.json` file that you can fill out at your own leisure.

## Editing package.json

The `package.json` file is used by npm, Node's package manager, to know about your project, its dependencies and how it works. We need to make a couple of edits to it.

* remove the `main` entry: this is only used for modules that will be used through the module system (e.g. `var _ = require('underscore');`).
* add `preferGlobal` and set it to true, which means if someone installs this module through npm and doesn't use the `--global` option, they will be warned that the module is designed to be installed globally.
* add the `bin` object, which maps commands to files. This means when this module is installed, npm will set up the `filesearch` executable to execute `index.js`.

```javascript
{
  "name": "filesearch",
  "version": "1.0.0",
  "description": "searches for files",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "JavaScript Playground",
  "license": "ISC",
  "preferGlobal": true,
  "bin": {
    "filesearch": "index.js"
  }
}
```

## Creating the Script

Create `index.js` and add this to the top:

```js
#! /usr/bin/env node

console.log('This is the filesearch script.');
```

## Installing the Script

Now in your project you can run `npm link` to install the script on your system. This creates a symlink to your project so that you can run the project whilst working on it, with no need to keep reinstalling it over and over again.

Once `npm link` has run, you should be able to run `filesearch` on the command line and see the string printed back:

```
~/git/filesearch > filesearch
This is the filesearch script.
```

## Processing Arguments

`filesearch` is going to be called with one argument, which is going to be the pattern to search through files for. We need to get at that argument. When a Node.js script is executed on the command line, the `process.argv` array contains all the arguments used to call that script.

Change `index.js` so it instead logs out this array:

```js
console.log(process.argv);
```

And now run the script again, this time with an argument:

```
~/git/filesearch > filesearch foo
[ 'node', '/Users/jackfranklin/.nvm/v0.10.32/bin/filesearch', 'foo']
```

The first argument is always `node`, and the second is the path to the file that has been executed. Any following arguments are ones that the user has called your script with, and those are the ones we care about. We can use `slice` to get an array of just the arguments we need:

```javascript
var userArgs = process.argv.slice(2);

var searchPattern = userArgs[0];
```

Now we have the one argument we need.

## Searching for Files

We'll hand the actual searching of the files over to a combination of two Unix commands, `ls` and `grep`. We can use `ls -a` to list all files in the current directory, and pass them to `grep` to search for our actual pattern.

To run a command in the system we can use the `exec` method of the `child_process` module - a module that comes with Node and doesn't need to be separately installed - to execute the right command, passing in the search pattern the user passed in through to `grep`:

```javascript
var exec = require('child_process').exec;
var child = exec('ls -a | grep ' + searchPattern, function(
  err,
  stdout,
  stderr
) {
  console.log(stdout);
});
```

And that is that! We can now run `filesearch` and see the results:

```
~/git/filesearch > filesearch package
package.json
```

## Next Steps

If this was a real module that I was working on publishing there's a couple of things I'd do before hitting `npm publish`:

* ensure a good, well written README
* decide on an initial version number (I tend to go for `0.1.0`) and then follow [semver](http://semver.org/)

When your module is ready, simply run `npm publish` to push it onto npm. If you've not registered on npm, you can run `npm adduser` and follow the prompts to set up and authenticate yourself.

Once published, users can then install your module using `npm install --global filesearch`.
