---
layout: post
title: "Exploring Backbone.js - Part 2"
---

A while ago I kicked off a planned series of Backbone.js tutorials with [Part 1](http://javascriptplayground.com/blog/2012/04/backbone-js-tutorial-1), which introduced Backbone as we set up a "shopping cart" - albeit an overly simplified one. Although it's been too long coming, today I've got part 2! I ended part 1 with some bullet points as things I wanted to cover:

* How do I add to a collection after initialising it?
* How can I show a filtered set of my objects?
* How do I let a user add a new item?
* How do I unit test my Backbone applications?
* Can I use Backbone.js with CoffeeScript?

Whilst I wont be covering them all today, I want to take on the 1st and 3rd bullet point, as they go hand in hand. So today, we'll edit our code to include a very simple form that lets us add a new item. Whilst this isn't so much in keeping with the shopping cart idea, it's the easiest way to demonstrate how to make the changes. In the upcoming parts we will start to model this into the shopping cart application.

_One thing that has become apparent is that in Backbone there a lot of different ways often to go about the same thing. I'm still learning Backbone too, so if you would have done anything that I do today differently, please let me know in the comments._

We need to make some changes to our existing code base. Firstly, in the comments of the prior article it was pointed out to me that setting `el` to be `$("#yourcart")` was bad. What I should do is set `el` to `"#yourcart"`, and then Backbone gives us `$el`, which is the same as `$(el)` which of course is `$("#yourcart")`.

Now, the way Backbone works in terms of events, is that you bind an event to an element using the form:

    events: {
    	"event selector":"method"
    }

This can be any element, however the element has to reside within the View's objects, which is all the elements in whatever you specified as `el` when declaring the view. _This had me stuck for ages!_.

There are many ways to get around this, but before I cover my solution, I've added this simple form just after the `<body>` tag:
<form id="add">
<label>Title</label>
<input id="title" type="text" />
<label>Price</label>
<input id="price" type="text" />
<input type="submit" value="save" />
</form>
My first solution was to update the `CartCollectionView` to just have `body` as its `el` and then save another for the wrapper around the items, like so:
var CartCollectionView = Backbone.View.extend({
el: "body",
$item_wrap: $("#yourcart"),

However, this seemed not very modular. Each view should deal with just one thing. I either needed another view to deal with the individual item wrapper, or another view to deal with the app as an entity. In essence, both lead you to a similar solution. I chose the first, so `CartCollectionView` would become the view for the entire app, and I created `ItemCollectionView` to deal with the HTML for listing all the items.

From here, `CartCollectionView` became:

    var CartCollectionView = Backbone.View.extend({
      el: "body",
      events: {
        "submit #add": "addItem"
      },
      initialize: function() {
        this.itemView = new ItemCollectionView();
      },
      addItem: function(e) {
        e.preventDefault();
        this.itemView.addItem();
      }
    });

As you can see, I set the `el` to just be `body`, so it encompasses everything. I then declare the events object. This simply states that when a `submit` event is triggered on `#add` (I gave the `form` that ID), call the `addItem` method. You can have as many of these as you want, in that format.

The `initialize` is also simplified, as all it does is create a new `ItemCollectionView`, which I'll show you shortly.

The main new piece of code is the `addItem` method, but all this does is use jQuery's `preventDefault()` to stop the form firing, and then call `addItem` on the `itemView`, which is what I stored the `new ItemCollectionView()` as.

Moving onto the `ItemCollectionView`, most of it you'll recognise, all I've done is move a lot of the code that was in the `CartCollectionView` over:

    var ItemCollectionView = Backbone.View.extend({
      el: '#yourcart',
      initialize: function() {
        this.collection = cartCollection;
        this.render();
      },
      render: function() {
        this.$el.html("");
        this.collection.each(function(item) {
          this.renderItem(item);
        }, this);
      },
      renderItem: function(item) {
        var itemView = new ItemView({model: item});
        this.$el.append(itemView.render().el);
      },
      addItem: function() {
        var data = {};
        $("#add").children("input[type='text']").each(function(i, el) {
          data[el.id] = $(el).val();
        });
        var newItem = new Item(data);
        this.collection.add(newItem);
        this.renderItem(newItem);
      }
    });

The only piece of code here that's new is the `addItem` method. The first thing it does it loop through all the text fields of the form and store the values to the new `data` object, using each input's `id` as the key (I set the `id` to "title" and "price" on the inputs). This builds us a simple object that we can now generate an Item from using `new Item(data)`. From there we add that item to the collection and then call `renderItem`, which creates the HTML for an item & then adds it to the `#yourcart` wrapper.

And that, as they say, is a wrap! At first I have to confess Backbone's way of doing this confused me, but after I managed to get my head around it it did begin to make sense. As always, you can find the code [on Github](https://github.com/jackfranklin/JS-Playground-Backbone/tree/tutorial2), and if you have any questions, please leave a comment. As I said earlier, if you'd have done this differently, I'd love to know, as there are a few different approaches. I will be amending the article with other solutions if they come up.
