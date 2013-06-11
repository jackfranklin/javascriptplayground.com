---
layout: post
title: More Refactoring
---

Last week's [refactoring post](http://javascriptplayground.com/blog/2013/06/refactoring-js/) turned out more popular than expected and I wasn't going to revisit it. However, it got so much interest that I'd like to.

Here's the code we ended up with at the end:

    var tabularize = function() {

      var tabsWrapper = $(".tabs");
      var tabs = tabsWrapper.children("div");
      var tabLinks = tabsWrapper.find(".tab-link");

      var activateLink = function(elem) {
        tabsWrapper.find(".active").removeClass("active");
        elem.addClass("active");
      };

      var activateTab = function(tabHash) {
        tabs.hide();
        $(tabHash).show();
      };

      var transition = function(hash) {
        activateTab(hash);
        activateLink(tabLinks.filter(function() {
          return $(this).attr("href") === hash;
        }).closest("li"));
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


_(If you haven't already, I recommend reading [the first post](http://javascriptplayground.com/blog/2013/06/refactoring-js/). This wont make much sense on its own)_

At that point, I ended the post with:

> "At this point, I would consider moving the tab code into a more structured form, such as an object. Doing it this way also makes it easier to move into a jQuery plugin, as the plugin can just call the object."

### The Further Refactoring

And I'd like to talk a bit about that here, as I had a lot of questions about it. Here's my final class version of the tabs code:


    var Tabularize = function(elem) {
      this.tabsWrapper = $(elem);
      this.tabs = this.tabsWrapper.children("div");
      this.tabLinks = this.tabsWrapper.find(".tab-link");
      this.checkHash();
      this.bind();
    };

    Tabularize.prototype = {
      bind: function() {
        var self = this;
        this.tabLinks.on("click", function(e) {
          e.preventDefault();
          self.transition($(this).attr("href"));
        });
      },
      checkHash: function() {
        var active = location.hash;
        if(active) {
          this.transition(active);
        }
      },
      transition: function(hash) {
        this._activateTab(hash);
        var link = tabLinks.filter("[href='" + hash + "']").closest("li");
        this._activateLink(link);
      },
      _activateLink: function(elem) {
        tabWrapper.find(".active").removeClass("active");
        elem.addClass("active");
      },
      _activateTab: function(hash) {
        this.tabs.hide();
        $(hash).show();
      }
    }

I have become a massive fan of abstracting things into objects like this in JavaScript. It forces you to structure your code better and positively influences the readability of your code (once you get used to this way of doing things).

### jQuery Plugin
The beauty of this is how easy it would be to turn into a jQuery Plugin. Rather than write a messy jQuery plugin to do all this tabbing code, all we have to do is create a jQuery plugin that instantiates a new version of the `Tabularize` object, passing in the element. Something like this should suffice:

    $.fn.tabularize = function() {
      return this.each(function() {
        new Tabularize(this);
      });
    }

I really like moving code out of jQuery plugins and making the jQuery plugin just call code that's contained elsewhere.

### Cleaner

Comparing the first refactoring to the second, in my opinion the second is definitely cleaner. The first has functions within function (a bad thing to do), and it's also unclear what methods are available. At a glance, it's difficult to quickly decipher. The second is much clearer. At a glance, I could tell you the main method names. I could also suggest that methods that start with an underscore are not designed to be used publically.

### Short Methods

Notice also that every method is very short. In [Ben Orenstein's Refactoring talk](http://www.youtube.com/watch?v=DC-pQPq0acs) at Aloha Ruby, Ben says that shorter methods are far superior, and he's coming round to the idea that every public method should be one line. The talk is on Ruby, but I still think some of the ideas are relevant. Whilst one line per method is perhaps ambitious, I am absolutely with Ben in terms of keeping methods short and this Tabularize object achieves that.

There's a lot of different ways to refactor and restructure, and you should by no means take what I've discussed in these posts as the only way to do things. If you'd have gone about this differently, please leave a comment, I enjoy seeing how others go about this.




