---
layout: post
title: "Custom jQuery Builds with Grunt"
---

A lot has been made of how, in the future versions of jQuery, it will be possible to easily build your own version of jQuery, without the parts you know you're not going to use.

What a lot of people don't realise is that you can do this today, if you're prepared to install Grunt and grab the raw jQuery repository from Github. This quick tip will show you how.

First you're going to need Node and npm installed. Then get Grunt installed too. Note that since Grunt 0.4.0 the way of doing this has changed slightly. In the future I'll be covering Grunt in more detail but for now, follow the below instructions to get it going:

- If you've ever previously installed Grunt 0.3.0, get rid of it: `npm uninstall -g grunt`.
- Now install the Grunt-CLI tool globally: `npm install -g grunt-cli`.

This means each project on your machine can use a different version of Grunt, if it so desires. The Grunt CLI tool will use the first local version of Grunt it can find, so you can have specific version numbers on a project by project basis.

Next, lets clone the jQuery repository:

	git clone git@github.com:jquery/jquery.git
	
Now navigate into that directory and install all dependencies:

	cd jquery
	npm install
	
The first time you clone the repository, you need to run Grunt once. This includes a number of tasks that update sub modules before running the tests and building jQuery:

	grunt
	
That will give you the full jQuery source minified into the `dist/` folder. But say you wanted to build jQuery without any of the Ajax built in, as your current project is not going to need it. Try:

	grunt custom:-ajax
	
You should get an output similar to this:

	Running "custom:-ajax" (custom) task
	Creating custom build...
	
	Running "build:all:*:-ajax" (build) task
	Excluding ajax             (src/ajax.js)
	Excluding ajax/script      (src/ajax/script.js)
	Excluding ajax/jsonp       (src/ajax/jsonp.js)
	Excluding ajax/xhr         (src/ajax/xhr.js)
	File 'dist/jquery.js' created.
	
	Running "uglify:all" (uglify) task
	Source Map "dist/jquery.min.map" created.
	File "dist/jquery.min.js" created.
	Uncompressed size: 209152 bytes.
	Compressed size: 16767 bytes gzipped (73066 bytes minified).
	
	Running "dist" task
	
	
	
	Done, without errors.
	
And there you go! It's not only the Ajax module you can remove, [The jQuery Repository documents all of them](https://github.com/jquery/jquery#modules). If you're going to be working on a project where file size is important, and you know there's parts of jQuery you wont use, it's certainly worth doing a custom build this way to save a few bytes.
