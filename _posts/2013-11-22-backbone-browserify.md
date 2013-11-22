---
layout: post
title: "Using Browserify with npm modules"
intro: "Today we will look at using Browserify for working with npm modules on the front end to build client-side JS applications."
---
Recently I covered [Browserify](http://javascriptplayground.com/blog/2013/09/browserify/) in another post, but did not go into much detail. I discussed how to use Browserify with your own modules, but what I didn't discuss was how Browserify can work with modules that have been published to npm too. In short: you can use Node modules on the client side.

In this tutorial, using a Backbone app as the example, I'll show you how to use Browserify to use npm modules, meaning you can use npm to manage your front end dependencies. This example uses Backbone, but you could use this with anything you like. Backbone just happens to be a good example in this case.

### A Basic Server

Firstly, let's get a basic server running. To do this I like to use the [Connect Module](http://www.senchalabs.org/connect/). First, install it:

    $ npm install --save connect

Then create `index.js` which looks like this:

    var connect = require("connect");

    connect.createServer(
      connect.static("app")
    ).listen(8080);

This just creates a very simple server that will serve static assets from the `app` directory. Perfect for what we need. You can run it like so:

    node index.js

### Installing Backbone

Now we need to install our front-end libraries. Firstly, Backbone:

    $ npm install --save backbone

We don't need to install Underscore, because Backbone has that set as a dependency. If we wanted to use Underscore ourselves, outside of Backbone's internal usage of the library, we'd have to install it then.

### Installing jQuery

Next, jQuery. In the near future, jQuery will be fully published to npm, but right now the version that is on npm is very out of date. Thankfully the new beta version of jQuery 2.1.0 has just been published, so for now we can install the beta from npm:

    $ npm install jquery@2.1.0-beta2 --save

In the near future, this will become `npm install jquery`.

### Browserify

First, make sure you've got Browserify installed:

    $ npm install -g browserify

Browserify works by taking in a file and walking through all the `require` calls within to bundle all your code up into a file that can be used on the front end. Create `app/app.js` and put this within:

    var Backbone = require("backbone");
    var $ = require('jquery/dist/jquery');

    Backbone.$ = $;
    console.log(Backbone);

The first thing we do is load in Backbone and jQuery. The odd path to jQuery is due to a [bug in the beta release](http://bugs.jquery.com/ticket/14548), which will be fixed soon. Once it is fixed, you'll be able to just use `require("jquery")`. Because Backbone usually sets its `$` based on the global environment, we need to set it up ourselves, so we simply set Backbone's `$` property to be jQuery. Then, to prove it's working, we'll log out Backbone to the console.

Create a basic HTML structure to hold our app (`app/index.html`):

    <!DOCTYPE html>
    <html>
    <head>
      <title>Backbone App</title>
      <script src="/bundle.js"></script>
    </head>
    <body>
      Hello World
    </body>
    </html>

Notice that we link to `bundle.js` in the HTML. It's time to generate that. Let's run Browserify:

    $ browserify app/app.js -o app/bundle.js

Browserify will create `app/bundle.js` with all our dependencies concatenated into one file.

### Running the app

You should now be able to run `node index.js`, visit `localhost:8080` and see the Backbone object logged to the console. Congratulations! We've just made a client-side JS app using npm modules and Browserify.

### Creating Modules

Of course, in a real Backbone app you'll want to split everything out into its own file, and Browserify can handle that just fine. For example, say I have a simple Book model in `app/models/book.js`:

    var Backbone = require("backbone");

    var Book = Backbone.Model.extend({
      defaults: {
        title: "A Book"
      }
    });

    module.exports = Book;

The key here is the last line, which is used by Node (and consequently, Browserify) to know what to return where another file requires this one. That sets up that our `Book` variable should be returned. We can now use this file in `app/app.js`:

    var Backbone = require("backbone");
    var $ = require('jquery/dist/jquery');
    Backbone.$ = $;

    var Book = require("./models/book");

    console.log(new Book().get("title"));

If you rerun Browserify and start up the server once more, you should see the line "A Book" logged to your console.

### Minifying Browserify's Output

Browserify by default doesn't minify the source code. We can get around this by using Uglify JS to do it. First, ensure you've got that installed:

    $ npm install uglify-js -g

Then we can run Browserify, piping the resulting JS through Uglify:

    $ browserify app/app.js | uglifyjs > app/bundle.js

This takes Browserify's output and runs it through Uglify before storing that output into `bundle.js`. During development, you may not want to do this, but of course on a production environment code should always be minified.

### Automating Browserify

Something you probably noticed is the need to always run Browserify. This is where you might use something like Grunt, or another build mechanism, to watch for file changes and run it for you. I'll be covering this in the future, but for now I'll leave that as an exercise for you.

### The Code

The code for this tutorial is available in full [on Github](https://github.com/javascript-playground/backbone-browserify).

I hope you enjoyed this tutorial, and any questions please do leave a comment.
