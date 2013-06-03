---
layout: post
title: Refactoring DOM Heavy JS
---

One of the things I've been getting more into recently is refactoring. It's something that is heavily talked about in the Ruby world, but seems to be a bit less so in the JS world. In this post what I've done is write some of my own (crappy) JavaScript for some simple JS tabs, using bad habits and code smells. I'll then look at how, if I was new to this code, I might start refactoring.

### Bad beginnings

You can view the "bad" code I started with [on Github](https://github.com/javascript-playground/refactoring-js/commit/3e0fd4f55daa77557044569b55397622d68c50d1).

Here is our starting point:

    var tabularize = function() {
      var active = location.hash;
      if(active) {
        $(".tabs").children("div").hide();
        $(active).show();
        $(".active").removeClass("active");
        $(".tab-link").each(function() {
          if($(this).attr("href") === active) {
            $(this).parent().addClass("active");
          }
        });
      }
      $(".tabs").find(".tab-link").click(function() {
        $(".tabs").children("div").hide();
        $($(this).attr("href")).show();
        $(".active").removeClass("active");
        $(this).parent().addClass("active");
        return false;
      });
    };

The corresponding HTML looks like this:

    <div class="tabs">
      <ul>
        <li class="active"><a href="#tab1" class="tab-link">Tab 1</a></li>
        <li><a href="#tab2" class="tab-link">Tab 2</a></li>
        <li><a href="#tab3" class="tab-link">Tab 3</a></li>
      </ul>
      <div id="tab1">
        <h3>Tab 1</h3>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
      <div id="tab2">
        <h3>Tab 2</h3>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
      <div id="tab3">
        <h3>Tab 3</h3>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
    </div>

Hopefully you're already starting to spot problems here. Here's a list of things I found that I'd like to change:

* __Selector reuse__. Notice how the code is full of `$(".tab")` or similar. This is bad, not just for efficiency, but just for the pain of having to update all these references if the class changes.
* __Not very DRY (Don't repeat yourself)__. There's plenty of duplication here across the two parts.
* Use of `click()`, rather than the preferred `on()`.
* Using `return false` rather than `e.preventDefault()`.
* It's very much tied to a specific DOM Structure. Often it's best to try to generalize your jQuery selectors and DOM traversal so smmall HTML changes (renaming a class, etc) don't break all your behaviour.

Something that I wont cover here is changing this code into a jQuery plugin. In reality I probably would do this, but in this instance I'd rather discuss specific refactorings within this system, so the moving to a plugin is just an abstraction too many.

### Breaking code down

This code is largely split into two parts. The first activates a specific tab if it is in the url. For example, if `http://foo.com/#tab2` is hit, the second tab will be activated. The second part adds click handlers to all the tab links so we can click to swap betweem them.

The first thing I like to do in this case is write some tests. I decided to use QUnit to do so. I wont go into great detail on QUnit ([I've written an intro to it before](http://javascriptplayground.com/blog/2012/04/javascript-testing-qunit-1/)), but you can [see the test JS on Github](https://github.com/javascript-playground/refactoring-js/blob/master/test/tests.js). I wont paste it in here as it's pretty long. Essentially I wrote tests that test:

* When we visit the page, the 1st tab is visible.
* When I click the link for tab 2, the 2nd tab is activated.
* When the URL has `#tab2` in it, the 2nd tab is activated when the page loads.

I am a big fan of having these tests as it means I can refactor with confidence that I'm not breaking things. Of course, I'll always manually test too, but having tests to back me up is great.

### Selector Reuse
First we should tackle the reusing of selectors. This one is easy to fix, just scan through the code and find any selectors, or DOM traversal methods, that are used lots. I've pulled out three, for now:

    var tabsWrapper = $(".tabs");
    var tabs = tabsWrapper.children("div");
    var tabLinks = tabsWrapper.find(".tab-link");

Now you've done that, you can go through and replace all instances of `$(".tabs")` with `tabsWrapper`, and so on. Rerunning my tests after [that commit](https://github.com/javascript-playground/refactoring-js/commit/6db02d7847330bc6bbd861cc7757806fb7d16205) shows us as all green. Great! The secret to refactoring is lots of little steps. No big steps at once.

### Spotting Duplication
Now lets look at the duplication. Across the code, there's a fair bit that is similar. The first is the process for marking the tab link as active. There's two bits to this:

1. Remove the `active` class from the current link.
2. Add the `active` class to the new link.

And we have to do this in two places, once within the code for checking hashes (we'll refactor that in a bit, but remember, small steps) and also in the click handler. This is where I'd typically make a method to do this for me:

    var activateLink = function(elem) {
      $(".active").removeClass("active");
      elem.addClass("active");
    };

And then use that in both places:

    if(active) {
      tabs.hide();
      $(active).show();
      $(".tab-link").each(function() {
        if($(this).attr("href") === active) {
          activateLink($(this).parent());
        }
      });
    }
    tabLinks.click(function() {
      tabs.hide();
      $($(this).attr("href")).show();
      activateLink($(this).parent());
      return false;
    });

Don't worry if right now you're spotting some code that doesn't look right (I know I am). Refactoring is all about going slowly, even if you end up undoing some of your work later on. Once again, the tests are green. [You can see the commit on Github](https://github.com/javascript-playground/refactoring-js/commit/eeab097e8070673fd8f39c5bfb1db69e43d8d0de).

### Quick wins
Now I want to do a couple of quick fixes in the event handler for the links. I'm going to swap out `click` for an `on` call, and swap `return false` for `e.preventDefault()`:

    tabLinks.on("click", function(e) {
      e.preventDefault();
      tabs.hide();
      $($(this).attr("href")).show();
      activateLink($(this).parent());
    });

If you're wondering why `return false` is bad, [give this post by Doug Neiner a read](http://fuelyourcoding.com/jquery-events-stop-misusing-return-false/). I've also moved the `preventDefault` call to the top, as I like for it to be immediately apparent that the default action is cancelled. Once again, we're green and [you can see the commit here](https://github.com/javascript-playground/refactoring-js/commit/29d9db8ab6d5604c8a20a0f45b8ff2d43de8b3c1).

### More duplication
There's some more duplication across the two parts of the code here. Similarly to before, the code for activating a new tab is in two places. It can be summed up as:

1. Hide all the tabs
2. Show the one tab

That's easy to write, and use:

    var activateTab = function(tabHash) {
      tabs.hide();
      $(tabHash).show();
    };
    ...
    if(active) {
      activateTab(active);
      ...
    }
    tabLinks.on("click", function(e) {
      e.preventDefault();
      activateTab($(this).attr("href"));
      ...
    });

And sure enough, we're green. [Here's that commit](https://github.com/javascript-playground/refactoring-js/commit/9ae8424b4cf99a097f6ef545e88bf578ee450450).

### Finding the active link
Now you can see the code for the URL hash and the event handler are very similar. In fact, the only difference is that the first has to search through all the links to find the one that should be active:

    $(".tab-link").each(function() {
      if($(this).attr("href") === active) {
        activateLink($(this).parent());
      }
    });

We can write this shorter though, using jQuery's `filter` method and selecting by attribute:

    if(active) {
      activateTab(active);
      activateLink($(".tab-link").filter("[href='" + active + "']").parent());
    }

That's a nicer way of doing things, even if it is quite a long line. I'd be tempted here to create a variable first:

    var link = $(".tab-link").filter("[href='" + active + "']").parent();
    activateLink(link);

Although it adds a line, it makes it cleaner, in my opinion. Remember, line count is not a measure of a good or bad refactoring. Our tests are green, and [here's that commit](https://github.com/javascript-playground/refactoring-js/commit/3caea006cef342269981e9ae2fabb205064fcfdb).

### The `transition` method

Now our two parts look identical. Both call `activateTab` and `activateLink`. Seems like that could become a method too:

    var transition = function(hash) {
      activateTab(hash);
      var link = $(".tab-link").filter("[href='" + hash + "']").parent();
      activateLink(link);
    };

Now all we have to do is pass a hash, like `"#tab1"` to `transition`, and everything is taken care of. I can update the code to reflect this:

    var active = location.hash;
    if(active) {
      transition(active);
    }
    tabLinks.on("click", function(e) {
      e.preventDefault();
      transition($(this).attr("href"));
    });

Now, in my opinion, that's much nicer than when we started. [Here's that commit](https://github.com/javascript-playground/refactoring-js/commit/07e063a4ceddca8aa4093c3bad9a4aecf4a088b6).

### Post Refactor
As a recap, here's what the JS looks like now:

    var tabularize = function() {

      var tabsWrapper = $(".tabs");
      var tabs = tabsWrapper.children("div");
      var tabLinks = tabsWrapper.find(".tab-link");

      var activateLink = function(elem) {
        $(".active").removeClass("active");
        elem.addClass("active");
      };

      var activateTab = function(tabHash) {
        tabs.hide();
        $(tabHash).show();
      };

      var transition = function(hash) {
        activateTab(hash);
        var link = $(".tab-link").filter("[href='" + hash + "']").parent();
        activateLink(link);
      };

      var active = location.hash;
      if(active) {
        transition(active);
      }
      tabLinks.on("click", function(e) {
        e.preventDefault();
        transition($(this).attr("href"));
      });
    };

Is it longer? __Yes__. Is it cleaner, more DRY and easier to follow? In my opinion, __Yes it is__. We've gone from a mess of spaghetti JavaScript with ugly selectors being reused, code being duplicated and the meaning obfuscated to a easier to follow, more organised structure.

### Better Structure
There's a bit more to be done here. There's also a big bug in the way tabs are activated based on the hash in the URL, but I'm going to leave that one to you to fix. At this point, I would consider moving the tab code into a more structured form, such as an object. Doing it this way also makes it easier to move into a jQuery plugin, as the plugin can just call the object.

I'm not going to go through it here, as this tutorial is long enough already, but have written and commited a new version to [a branch on Github](https://github.com/javascript-playground/refactoring-js/tree/class-version) for you to fully dive into.

### To conclude

Refactoring is fun! It's probably my favourite part of being a developer. Things that I try to do as typical refactorings are:

1. Put things in variables if you reference them often.
2. Remove temporary variables, or variables that are only used once (some exceptions to this).
3. Don't be afraid to make more functions. The best functions are small functions.
4. Don't be afraid to add a bit more structure at the expense of line count (which is very rarely a good measure of code).
5. Have some tests to back up if your refactoring is going well and hasn't broken functionality.
6. Take lots of small steps. Move very slowly, and resist the urge to immediately refactor everything at once. Be methodical.

I hope this was a useful post. If you've any queries or questions, leave a comment and I'll endeavour to get back to you. Alternatively, you can drop me a tweet (@Jack_Franklin) or feel free to email me too.

