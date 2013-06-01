---
layout: post
title: "Exploring Backbone: Part 1"
intro: "Backbone.js is a framework that lets us structure our applications using a pattern similar to MVC. However, Backbone is a powerful system to use when creating apps that are beyond very basic. When passing & manipulating a lot of data, you should consider using something like Backbone."
---
[Backbone.js](http://documentcloud.github.com/backbone/) is a framework that lets us structure our applications using a pattern similiar to MVC (technically Backbone is not pure MVC as the C stands for "Collection"). However, Backbone is a powerful system to use when creating apps that are beyond very basic. When passing & manipulating a lot of data, you should consider using something like Backbone.

Since launching this blog I've had a lot of people ask me about Backbone. Although there are a lot of very good resources out there, I have struggled to get to grips with it myself and from the requests I've had I'd suggest a lot of others have too. So, I sat down to create a sample application with Backbone, and in this tutorial - which will span at least 3 parts - we will create a very simplified shopping cart application, with Backbone. As always the source will be on Github and is linked to at the end of this post.

The first thing to do is set up our basic page and include our dependencies. Backbone relies on Underscore.js, a set of utility functions written by Backbone's creator, Jeremy Ashkenas (who also created CoffeeScript). You need to download Underscore.js, Backbone.js & include jQuery too, which I do from the Google CDN. The Backbone link can be found above at the beginning of this article, and [here's the link for Underscore.js](http://documentcloud.github.com/underscore/). I've also created a stylesheet & `cart.js`, which is where the majority of our code will go:

    <!DOCTYPE html>
    <html>
      <head>
        <title>Shopping Cart with Backbone</title>
        <link rel="stylesheet" type="text/css" href="css/style.css">
      </head>
      <body>
        <div id="yourcart"></div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script src="js/underscore.js"></script>
        <script src="js/backbone.js"></script>
        <script src="js/cart.js"></script>
      </body>
    </html>
  
The first thing we want to do is create a model. A model is a way we can represent data in an application, and the objects that we have in our application. We're going to have just one thing today, which is items, which sit in a shopping cart. The convention is to name a model as singular & capitalise it, so our model will be `Item`. To create a model we extend `Backbone.Model` like so:

    var Item = Backbone.Model.extend({
      defaults: {
        price: 35,
        photo: "http://www.placedog.com/100/100"
      }
    });
  
Here I set up the default values for my item. It's going to have three fields, a title, price & then a photo. Whilst I don't want to set a default title, I set the defaults for the other properties. [There's a lot you can do by extending models](http://documentcloud.github.com/backbone/#Model-extend) which I will revist in a future tutorial. If you fancy reading some more now, check out that link to the documentation. Now new items can be created easily. Load up `index.html` in the browser & try this out in the command line:

    var football = new Item({title: "Football"});
    football.get("title"); //"Football"
    football.get("price"); //35
    football.get("photo"); //http://www.placedog…
  
However, this functionality on its own is not very good. We need some way of managing sets of data, and this is where Collections come in. We can create a new collection which will store data, and tell it which model to use:

    var Cart = Backbone.Collection.extend({
      model: Item
    });

Now refresh the page, load up the console & try this:

    var collection = new Cart({title: "football"});
    collection.at(0).get("price"); //35
  
You can initialise a collection by passing it either a single object or an array of objects, all of which it will presume are instances of the model we specified above It will then use the values passed to create an instance of the model for each object passed in. The `at()` method gets an object at a specific index and returns it.

Now we have a collection & a model, we've done the "MC" bit of "MVC". So lets hook it up into a view to explore the basics of views in Backbone & then we'll wrap this up for today.

Firstly, we need some sample data to work with, so I'm going to create some sample items and initialise our `Cart` collection with them:

    var items = [
      { title: "Macbook Air", price: 799 },
      { title: "Macbook Pro", price: 999 },
      { title: "The new iPad", price: 399 },
      { title: "Magic Mouse", price: 50 },
      { title: "Cinema Display", price: 799 }
    ];
  
    var cartCollection = new Cart(items);
  
Each view you create should be responsible for a small part of your application. I want to end this tutorial by showing all the items we have on the page, laid out neatly. Rather than having 1 view & dealing with everything in there, I'm going to set up two. The first will be the template for an individual item, and the second will be for showing every single item. Before we write the JS, we need to make a quick HTML template for it, using the templating engine that comes with Underscore. These should go within script tags in `index.html`:
  
    <script id="itemTemplate" type="text/template">
        <img src="<%= photo %>" alt="<%= title %>">
        <div>
          <h2><%= title %></h2>
          <h4>&pound;<%= price %></h4>
        </div>
    </script>
  
You can see what will happen here. Where I've used `<% = title %>`, that will be replaced with the item's title, and so on. I've given it a type of `text/template`, if we used `text/javascript`, the browser would try (and fail) to parse it.

Now I can write the JS for the view for a _single item_:

    var ItemView = Backbone.View.extend({
      tagName: "div",
      className: "item-wrap",
      template: $("#itemTemplate").html(),
    
      render: function() {
        var templ = _.template(this.template);
        this.$el.html(templ(this.model.toJSON()));
        return this;
      }
    });
  
`tagName` and `className` tells Backbone to wrap the template within a `div` with a class of `item-wrap`. We give it the template, grabbing the code from our `script` tag. The default for `tagName` is `div`, so I could haveb left it out, but I wanted to put it in to highlight the fact it exists. The `render` method just uses Underscore's `template()` method to parse the template. We then call it with a JSON representation of the current model - which for this view will be an individual item. `$el` is a variable automatically set for us which stores a jQuery reference to the current object. Backbone does this for us to save us a bit of time and it comes in very handy. Note that in the `render` method we return `this`. This is so we can call this method from another view, and get access to the returned data. Whenever a view is rendered, one of the properties it has is `el`, which is the fully compiled template, with  every `<%= title %>` substituted for the correct value and so on. We will use this in our next view.

On its own however, this view doesn't serve a purpose. Right now it will render some HTMl for each individual item, but as I said earlier we want to write another view that shows all the items. This one is a bit more complex:

    var CartCollectionView = Backbone.View.extend({
      el: $("#yourcart"),
      initialize: function() {
        this.collection = cartCollection;
        this.render();
      },
      render: function() {
        this.collection.each(function(item) {
            this.renderItem(item);
          }, this);
      },
      renderItem: function(item) {
        var itemView = new ItemView({ model: item });
        this.$el.append(itemView.render().el); 
      }
    });
  
Don't panic! We shall work through this line by line. Right at the beginning, you will see I hard coded into `index.html` the `div` with an id of "yourcart". Here I give Backbone a reference to it. From this Backbone will also create `this.$el`, a jQuery reference to the element. Of course, I've actually done this already by setting `el` to be `$("#yourcart")` but it's still handy to know. 

The `initialize()` method tells the view which collection to use, which I set to `cartCollection`, which we set up earlier. I then make it call its own `render()` method. The `render` method takes the collection, and then uses `each` to loop through each item within the collection. The first argument is the iterator function, in which I just call `renderItem()`, passing the item in. The second argument is the context, which I pass in as `this`. This means the function is invoked with the value of `this` equal to whatever `this` was when it was invoked. In my case, this will mean `this` refers to the `CartCollectionView` object

Finally, `renderItem()` takes an item, creates a new `ItemView()` for that specific Item, passing in the `model` property. From there we append the compiled `ItemView` template (remember the discussion about returning `this` within `ItemView` earlier? This was why) to `this.$el`, which is `$("#yourcart")`. 

That's it. Although the code looks pretty overwhelming on the surface, once you look into it it's not so bad. Finally, all we need to do is instantiate a new instance of our main view when the DOM is ready:

    $(function() {
      var cart = new CartCollectionView();
    });

And then (after a quick bit of CSS) you'll see this:

![](https://img.skitch.com/20120422-k2f196g9jeuw8578hxcsb591i8.jpg)

I'm not going to cover the CSS, as I'm no designer, but it's in the repository if you want to take a look. It's hardily design of the century, mind.

So, at this point we're done for today. We've done a lot of stuff, but I bet you've got a lot of questions, such as:

* How do I add to a collection after initialising it?
* How can I show a filtered set of my objects?
* How do I let a user add a new item?
* How do I unit test my Backbone applications?
* Can I use Backbone.js with CoffeeScript?

And plenty more. I hope to answer all of the above & more in the future. Backbone is a big topic, there's lots of cool stuff it's capable of & today we've really barely scratched the surface. As always, any questions please leave a comment & I will answer them all in the next part, which will come soon. Code for this tutorial is [on the Github repository](https://github.com/jackfranklin/JS-Playground-Backbone).
