---
layout: post
title: "A jQuery Pub Sub Implementation"
---

Having [discussed the Module pattern](http://javascriptplayground.com/blog/2012/04/javascript-module-pattern) briefly a few days ago, today I want to tackle another pattern, the Pub Sub (or _Publish_ and _Subscribe_) pattern, also known as the Observer Pattern. If you've not heard of this implementation, it's pretty straight forward. It allows different aspects of your application, usually called _modules_, to both subscribe to events other modules might publish, & publish events itself. This means no two modules of your system are directly linked, as each module just relies on events to know what to do & when to do it. In the future we'll look into this pattern using plain JavaScript, but as an introduction to it it makes sense to use jQuery, a framework that allows us to publish & subscribe to events really easily, using `.on()` [which I covered very recently on this very blog](http://javascriptplayground.com/blog/2012/04/jquery-1-7-event-binding-on-and-off) and then `.trigger()`, which lets us trigger events. Most people will use this to trigger events like `click` or `submit`, but did you know you can use it to trigger your own, custom events? It's this functionality we will use today.

The app we will be building is very simple, it's a little app that lets you send messages to yourself. Of course, this is very, very easy (it's a bit of DOM manipulation) but the app is split up into 3 parts which lets me nicely demonstrate some of the PubSub ideas. The app can be seen on the [online demo here](http://javascriptplayground.com/demos/jquerypubsub/)

There are three key parts:

* User sends a message via the form,
* message is shown on the right panel,
* flash notice displays on top of screen to notify user.

The source code for this is all available on Github so for the purposes of this tutorial I wont talk at all about the (tiny) bit of CSS I've done or even the HTML, it will focus purely on the JavaScript. All you need to know really is that I've got a `div#flash` for the flash message, a `form` for sending a message and that each message is displayed as a `li` inside a `ul`. All of our code will go inside a JavaScript object I'm going to call `pubsub`, although in real life it would most likely be called something more relevant to your app:

    var pubsub = {

    }

Firstly, lets tackle what happens when a user submits the form. We can use jQuery's `submit` event to hijack the event & prevent the default action easily enough:

    $("form").on("submit", function() {
    	return false;
    });

Then I'm going to want to call my method for dealing with this event. In practise, each module would probably have its own namespace and have its events in there, such as:

    pubsub.messages.send
    pubsub.messages.receive
    pubsub.flash.show
    pubsub.flash.hide

But as we have only 3 events, I'm going to keep them in the main `pubsub` namespace. So lets create our event for the sending of a message. Within our `pubsub` object, add this method:

    sendMessage: function() {
    	var message = $("input").val();
    	$("body").trigger("messageReceived", { message: message});
    	return false;
    }

Notice how with `.trigger()` we can send extra data through as the second parameter, so this makes it easy to send custom data with our custom events. You may have realised, but as part of our system we're going to need to bind our functions to regular DOM events, such as the form `submit` event. I decided, as there's very few, to create a new method within `pubsub`, called `bindEvents()` that will do that for me. Here's the code for all the events we need:

    bindEvents: function() {
    	$("form").on("submit",function() {
    		pubsub.sendMessage();
    	  	return false;
    	});
    	$("body").on("messageReceived", function(event,data) {
    	  	pubsub.displayMessage(data);
    	});
    	$("body").on("messageDisplayed", function(event, data) {
      		pubsub.flashMessage();
    	});
    }

Note that when we pass data through an event, like we did with `messageReceived`, we get at it through `function(event, data)`. By default jQuery passes us lots of information about the event and then custom data is passed as the _second parameter_.

Obviously, this could (and will) get messy if we had many more events, so again if there were more I'd split these up further into the individual modules, and probably give each module an `init()` method to do the set up, and then a `bindEvents()` method for each module to set it up. Speaking of `init()` methods, I'll add one to `pubsub` and for now have it just call `bindEvents()`:

    init: function() {
    	this.bindEvents();
    }

Then we can set our entire app up when the DOM is ready with:
$(function() {
pubsub.init();
});
Now, the `displayMessage()` and `flashMessage()` methods are fairly straight forward:

    displayMessage: function(data) {
    	$("body").trigger("messageDisplayed");
    	var li = $("<li />").text(data.message).css("display", "none");
    	$("ul").append(li);
    	$("ul>li").last().fadeIn()
    },
    flashMessage: function() {
    	$(".flash").text("you've got a new message")
    	.fadeIn(500, function() {
    	  var that = this;
    	  setTimeout(function() {
    	    $(that).fadeOut(500);
    	  }, 2000);
    	});
    }

Notice that every event I trigger is on `$("body")`. There's no reason I couldn't do it on a particular `div`, but I like to do it on `body` as I know that `body` incorporates everything on the page. The code for each of these methods are pretty straight forward, just a bit of jQuery DOM manipulation.

All the code covered in this article is available on [My Github as a Public Repository](https://github.com/jackfranklin/JavaScript-Playground--Simple-jQuery-PubSub), and if you want to try it, [there's a demo online here](http://javascriptplayground.com/demos/jquerypubsub/).

Now, this might not seem very worthwhile _in this instance_, but take a moment to think what you would have had code wise, if you had implemented all of the code above within the form's `submit` event (like I have done in the past with projects, and I'm sure you have too). It would be a complete mess of code, all within one form event. Then imagine you had another method of sending a message. How would you deal with that? You would either have to copy & paste all the code into another event, or trigger the form's `submit` event. Neither of those solutions are good. With this method though, all you have to do is make that new way of sending messages trigger a `messageReceived` event & pass the message with it, and then you're set. You could then remove the other way of sending messages, and nothing would break. Another issue is if one module breaks, it _shouldn't break the entire application_. Having the entire implementation within one function means if just one line fails, the entire application will fall to its knees. With each module firing events, if one module fails and doesn't send the events it's expected to, other modules can still send theirs, and as such one module breaking doesn't bring the application down. This is the advantage of using such a pattern, code resuse, not repeating code & implementing a modular approach.

I will be covering this pattern in large detail over the near future as it's something I've been using a lot recently. I'm aware that this implementation is another post on the JavaScript Playground that uses jQuery, but fear not, in a coming article we will go head on into a basic PubSub written in plain JavaScript. If you can't wait that long, [Addy Osmani's section on the Observer Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript) in his JS Patterns book is well worth your time.
