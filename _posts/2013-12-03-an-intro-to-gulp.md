---
layout: post
title: An introduction to Gulp
intro: Gulp has been doing the rounds as a good alternative to Grunt, and this article gives you an introduction to this different approach to tooling.
---

[Gulp](https://github.com/wearefractal/gulp) has been doing the rounds recently online through Twitter as an alternative to Grunt in the JS build tooling space. Whilst I am a huge fan of Grunt, looking at other options never hurts, so I thought a quick introduction to Gulp might be fun to do.

Gulp works with Node streams. Whereas Gruntfiles can often become very difficult to maintain and large, Gulp tries to avoid too much configuration and keep things simple. The base idea is that you glob for some files, and pipe them through a plugin, changing the output in some way or another. If you need a refresher on streams, the [Streams handbook](https://github.com/substack/stream-handbook) is the best place to go.

You install Gulp just like you'd expect, through npm:

    $ npm install -g gulp

Much like Grunt looks for a Gruntfile, Gulp will look for a file called `Gulpfile.js`. You'll also need to install Gulp locally in the project too:

    $ npm install --save-dev gulp

Gulp comes with a very minimal set of tools, and everything else comes in the form of plugins. We're going to use the [JSHint plugin](https://github.com/wearefractal/gulp-jshint), so let's install that too:

    $ npm install --save-dev gulp-jshint

Now we're ready to write our `Gulpfile.js`. It starts off by requiring gulp and jshint:

    var gulp = require("gulp");
    var jshint = require("gulp-jshint");

Whereas with Grunt we have to call `initConfig`, passing in a huge object full of configuration, in Gulp we define tasks by calling `gulp.task`. This takes two arguments, the name of a task, and a function which will be run when you call that task. In the case of Grunt, most plugins will define a task for you (For example, the Grunt JSHint plugin defines the `grunt jshint` task for you), but in gulp plugins just provide methods to hook into. The tasks are all defined by you.

Let's look at an example of a task. Here I've written a "lint" task that will run JSHint against all files in the root of the `src/` directory:

    gulp.task("lint", function() {
        gulp.src("./src/*.js")
            .pipe(jshint())
            .pipe(jshint.reporter("default"));
    });

Firstly, `gulp.src` will return a representation of files that match the glob, that can be piped directly into plugins. Hence, we can take all those files and pipe them directly into `jshint()`, which is the function made available by the `gulp-jshint` plugin. This runs each file one by one through JSHint, and we then pipe the result of that through to the JSHint reporter, which is responsible for showing us the results.

We can now run `grunt lint` to see the result of this:

    git/jsplayground/gulp-intro gulp lint
    [gulp] Using file /Users/jackfranklin/git/jsplayground/gulp-intro/Gulpfile.js
    [gulp] Working directory changed to /Users/jackfranklin/git/jsplayground/gulp-intro
    [gulp] Running 'lint'...
    [gulp] Finished 'lint' in 0.004 seconds

And if I make a file break a JSHint rule (such as missing a semi-colon), I'll see this:

    [gulp] Using file /Users/jackfranklin/git/jsplayground/gulp-intro/Gulpfile.js
    [gulp] Working directory changed to /Users/jackfranklin/git/jsplayground/gulp-intro
    [gulp] Running 'lint'...
    [gulp] Finished 'lint' in 0.006 seconds
    ./src/one.js: line 1, col 29, Missing semicolon.

    1 error

One thing I personally don't like about Gulp is its output; I think Grunt's is more clear, but you can see that gulp reported the problem to us.

Gulp also has a default task, which will run when you run just `gulp` on your command line:

    gulp.task("default", function() {
        gulp.run("lint");
    });

Here I set up the default task to just run our "lint" task.
