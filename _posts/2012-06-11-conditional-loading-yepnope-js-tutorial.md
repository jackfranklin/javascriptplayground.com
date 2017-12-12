---
layout: post
title: "Conditional Loading with YepNope"
---

In today's tutorial I want to take a look at [yepnope](http://yepnopejs.com), which is an asynchronous resource loader that works on conditions. That is, you give it a test, and depending on the result of that test, you can load in additional scripts.

This is used a lot when loading a Polyfill for a HTML5 feature, such as placeholders. You can detect if they are supported, and if they are not, bring in a JS script to add support. I used to think that was the only use for yepnope, but having used it on a client project recently I found a slightly different use, which I wanted to demonstrate today.

On the site in question, all scripts are loaded just before the closing `</body>`, but because we have a lot of static pages on this site, all the scripts are within an individual file, which is then included through PHP includes. Thus, the issue was every script was getting loaded on every page, even when we didn't need it to be. For example, two of the pages use NivoSlider, but every page was loading it in. I decided to see if Yepnope would be a good fit to solve this issue, and it turned out to work quite well.

The first thing I want to show is that yepnope can be used just to load in scripts, although that's not its main strength:

    yepnope({
      load: ['https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', '/js/nav.js'],
      complete: function (url, res, key) {
      	//jQuery & nav.js is loaded
      }
    });

Those two scripts were the ones I needed on every page, so I chose to load them in. A key thing here that had me stuck is yepnope's callbacks. There are two you'll generally use after loading in files, `callback` and `complete`. There is a subtle but _very_ important difference between them. When you're loading in multiple files, `callback` fires after _each one individually is loaded_, whereas `complete` fires after _all the files are loaded_.

From here, I want to test if we need to load in the NivoSlider plugin. All elements on the site with a slider have an ID of `slider`, so within the `complete` callback, it's an easy test:

    $(function() {
      yepnope({
        test: $("#slider").length,
        yep: '/js/jquery.nivo.slider.pack.js',
        callback: function(url, res, key) {
          $('#slider').nivoSlider();
        }
      });
    });

I make sure the DOM is ready before running the tests, so we don't get a negative result purely because the DOM isn't ready. To evaluate conditionally you must pass a `test` property into yepnope. This can be any expression at all that will evaluate to give `true` or `false`. This means of course that you can load in a script based on more than one thing: `test: a && !b`.

The test is if we have any elements with an id of `slider` on the page. You have to test for `.length`, as an empty array actually evaluates to `true` in JavaScript. Obviously `length` will return 0 or higher, and 0 evaluates to `false`, which is what we want.

From there it's easy, if the test is true, I can load in my slider script. Note that you don't have to pass both `yep` and `nope` - you can do just one or the other if that's all you need.

I then use `callback` - I don't need to use `complete` here as it's only 1 script I'm loading, and execute the `nivoSlider()` on my slider.

That's one use for yepnope and one I've been using quite a lot recently, it really does make conditional script loading much easier to do. In terms of other use cases, it ties in very nicely with Modernizr. You can load in polyfills based on the results of Modernizr tests, which gives you a lot of power.
