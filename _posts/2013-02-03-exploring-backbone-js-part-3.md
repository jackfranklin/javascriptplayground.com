---
layout: post
title: "Exploring Backbone.js - Part 3"
---

Way back in June last year I published [part two of my Backbone series](http://javascriptplayground.com/blog/2012/06/exploring-backbone-js-part-2) and today, at long last, it's time to pick up the pieces. I apologise for such a lull between articles and hopefully it wont be quite so long between this and the next episode! I recommend you go back and skim [Part 1](http://javascriptplayground.com/blog/2012/04/backbone-js-tutorial-1) and [Part 2](http://javascriptplayground.com/blog/2012/06/exploring-backbone-js-part-2) first just to get up to speed.

Last time I left off we had just written the code to add a new item to our collection. What I'd like to do today is look at how we might filter down items in a collection. This will set us up nicely for the next article, which will look at Backbone's Router in more detail.

Firstly, lets set up the HTML needed to allow a user to filter down by price.

    <form id="filter">
      <label>Less Than</label>
      <input type="text" id="less-than" />
      <input type="submit" value="Filter" />
    </form>
    <a href="#" id="clear-filter">Clear Filter</a>

For now we will keep it simple and just let the user search for items less than a particular price.

Next we need to set up some events on our `CartCollectionView`. If you remember, this view encompasses the entire of our application (its `el` property is set to `"body"`), so this is where a lot of our events are set up. If you're thinking perhaps this isn't the best way, you're right. In a future episode when we add a couple more views, we will tidy this up. Add two more events to the `events` property:

    events: {
       "submit #add": "addItem",
       "submit #filter": "filterItems",
       "click #clear-filter": "clearFilter"
     }


The methods we need to add to the cart collection view are very straight forward. All they will do is cancel the default action and then call methods on `itemView`, which is the view that all our items sit within.

    filterItems: function(e) {
      e.preventDefault();
      this.itemView.filterByPrice();
    },
    clearFilter: function(e) {
      e.preventDefault();
      this.itemView.clearFilter();
    }

To filter the items down to those lower than a specific price, here's what we need to do:

1. Loop through every element in the collection and see if it matches the filter.
2. Re-render the item collection view with just those items in.

Here's the entire code. Give it a read, and I'll explain it in depth below.

    filterByPrice: function() {
      // first reset the collection
      // but do it silently so the event doesn't trigger
      this.collection.reset(items, { silent: true });
      var max = parseFloat($("#less-than").val(), 10);
      var filtered = _.filter(this.collection.models, function(item) {
        return item.get("price") < max;
      });
      // trigger reset again
      // but this time trigger the event so the collection view is rerendered
      this.collection.reset(filtered);
    },

The first thing we do is `this.collection.reset(items, { silent: true })`. This will reset the collection, which is a way of completely changing the items in a collection. Here I reset it to the original array of items, which was stored in `items`. By passing in `{ silent: true }`, it means it wont trigger the `reset` event on the collection. We'll use this event later, and then you'll see why it's important not to trigger it there.

After that we grab the value from the input. I'm not doing any validation here which is obviously not sensible - but for the purposes of demonstrating Backbone it will do just fine. Then we can use Underscore's `filter` method. This takes an array of items, in this case all the models in the collection, and loops over them. Any that return `true` from the callback are returned. Therefore after running `filter`, only elements with a price less than the maximum will be returned. Then we can reset the collection again, but this time to just the filtered items.

Head up to the `initialize` method of the `ItemCollectionView` and at the bottom add a binding to the `reset` method that's called on the collection.

    initialize: function() {
      this.collection = cartCollection;
      this.render();
      this.collection.on("reset", this.render, this);
    },

This means when a "reset" event is triggered on this view's collection, it will call the `render` method, with the context bound to `this`, which is the `ItemCollectionView`. Therefore when we detect the collection has been reset, we can re-render the view. This is why when we reset the collection to contain all elements, we passed in `{ silent: true }`. Else, we would re-render the item view to all elements just before we filtered it again, which wouldn't be very efficient.

Finally, we need to add the code for clearing the filter. The `clearFilter` method on the `ItemCollectionView` is very straight forward:

    clearFilter: function() {
      $("#less-than").val("");
      this.collection.reset(items);
    }

All it does is clear the input, and reset the collection back to all items.

With that, filtering and clearing the filter should work! There is a pretty big bug though. If you add a new item, and then do some filtering, that new item will not appear. This is because we reset the controller to contain `items`, which is our original set of items, and doesn't include any new items the user added. What we need to do is keep track of when we add a new item, and update our `items` array to contain those new items. When a collection's `add` method is called, it triggers an `add` event. Lets use this to solve our bug. Head to where we set up `var Cart` as our collection of items, and edit it so it looks like so:

    var Cart = Backbone.Collection.extend({
      model: Item,
      initialize: function() {
        this.on("add", this.updateSet, this);
      },
      updateSet: function() {
        items = this.models;
      }
    });

It's just a case of updating the original set of items when a new one is added. Now new items that are added can be filtered, and are not lost when we filter and then clear the filter.

The code for this tutorial and the entire series is available [on Github](https://github.com/javascript-playground/backbone-beginners/tree/tutorial3). Please note that this repository is no longer on my personal account but on the [JavaScript Playground](https://github.com/javascript-playground) organisation, which is where all future code will live.
