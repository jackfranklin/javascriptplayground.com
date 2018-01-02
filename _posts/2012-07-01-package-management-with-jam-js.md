---
layout: post
title: "Package Management with Jam JS"
---

Today we'll take a look at [Jam JS](http://jamjs.org/), a JavaScript Package Manager. This uses [RequireJS](http://requirejs.org/) to load in your required packages and makes using JavaScript libraries much easier.

The first thing to do is install it. This is done through the Node Package Manager, which I'll presume you've got installed. If not, you need to install Node.js & NPM; there are plenty of resources online for helping you do this. To install simply run:

    npm install -g jamjs

The `-g` makes it install globally, which gives you the `jam` command to run on the command line.

Lets create a new project, which will be a simple website with some jQuery written to change the background colour of the website. For this usually I'd pull in jQuery from Google's CDN, but Jam can download & set this up for us.

Head into your project's directory and run:

    jam install jquery

This will download the latest version of jQuery and put it into `./jam/jquery/jquery.js`. By default all packages are installed to `./jam`. Now, we could just include that script manually, but Jam comes with RequireJS to manage this for us.

Firstly, here's my `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Jam JS</title>
    <script src="jam/require.js"></script>
    <script src="app.js"></script>
  </head>
  <body>
    <h2>Using Jam JS</h2>
  </body>
</html>
```

The key here is including `jam/require.js`, which pulls in the RequireJS source, all configured to work with Jam's directory structure for packages.

The work is done in `app.js`:

    require(['jquery'], function () {
      var changeBg = function() {
        var body = $("body");

        var colours = ["red", "blue", "green", "yellow"];

        body.css("background-color", colours[Math.floor(Math.random()*colours.length)]);

        setTimeout(changeBg, 2000);

      };

      $(function() {
        setTimeout(changeBg, 2000);
      });
    });

That code just changes the background colour every 2 seconds, but the important bit is in the top line:

    require(['jquery'], function() {});

RequireJS takes in a list of modules to load, and then a callback function to run once they are all loaded.

So far, you might be wandering what the main advantage of Jam is. So far, it's been useful but nothing ground breaking. The main advantage for me is that you can update your scripts automatically. I don't know about you, but a lot of my projects still use old versions of libraries because I never got round to updating them. Well, with Jam it's as simple as:

    jam upgrade

This checks all your libraries and will download new versions if required. You can also check for upgrades for an individual package:

    jam upgrade jquery

However, sometimes you might want to stay at a specific version. Imagine jQuery 1.9 (not out yet, of course) introduces a change that breaks your application. You can tell Jam to lock jQuery at 1.8.x with:

    jam lock jquery@1.8.x

This will allow it to upgrade jQuery all the way through 1.8 but not to 1.9. When the time comes for you to upgrade & fix those issues, you can unlock & upgrade it again:

    jam unlock jquery
    jam upgrade jquery

To view all your packages, you can do `jam ls`.

You can see the list of Jam's packages [on the Jam site](http://jamjs.org/packages/#/), and also search. Whilst Jam is relatively new and does not have a huge library, a lot of very popular tools are on Jam, including jQuery, Underscore, CoffeeScript, Backbone, Handlebars and more.

Once you've got all your packages installed and your website done, it's time to put it live. We all know it's bad practise to include all these scripts individually, so Jam provides a mechanism to pool all our scripts into one. This will compile every library and the RequireJS source into one file:

    jam compile output.min.js

This will produce `output.min.js` which can then be included when putting your site into production.

That brings to an end this whirlwind tour of Jam JS. Tools like this are becoming all the more common for JavaScript development & that's a good thing. In the next couple of months I'll be taking a look at a few tools that attempt to improve the JavaScript workflow & make managing libraries and packages easier.

In a tutorial next week, I will show you how to make your own library a Jam package and publishing it for everyone to use.
