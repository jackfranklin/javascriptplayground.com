---
layout: post
title: Pub Sub with Event Emitter
---

I'm a big fan of the Pub Sub (Publish, Subscribe) design pattern, and it's one that I tend to reach for often. I've [written previously](/blog/2012/04/a-jquery-pub-sub-implementation/) about it, but that was using jQuery and was frontend specific. Today I'd like to swap and look at using this pattern in Node.js environments.

The idea behind the Pub Sub approach is that objects can publish events, and data associated with those events. Other objects (or the same one) can then subscribe to those events, and be notified when those events occur, and gain access to the data in the event too.

The reason that this is a good thing is because it keeps modules decoupled. Module A can subscribe to the events Module B publishes, and vice versa, without the other one knowing that they have. The less an individual module knows about other modules, the better.

It's nice and straight forward using Node's EventEmitter class, too:

    var EventEmitter = require('events').EventEmitter;

    var server = new EventEmitter();

    server.on('foo', function() {
      console.log('got foo');
    });

    server.emit('foo');

In a system with multiple modules, I've taken the approach of passing in my EventEmitter instance when creating my modules:

    var emitter = new EventEmitter();

    moduleA.init({
       emitter: emitter 
    });

    moduleB.init({
       emitter: emitter 
    });
    
That way the two can publish and subscribe to the same instance.

We can also create modules that inherit from the EventEmitter. This means that you can call EventEmitter methods like `on` and `emit` directly on your own modules:

    var EventEmitter = require('events').EventEmitter;
    var util = require('util');

    var ModuleA = function() {
      this.init();
    };

    util.inherits(ModuleA, EventEmitter);

    ModuleA.prototype.init = function() {
      this.on('done', function() {
        console.log('done');
      });
    }

    ModuleA.prototype.doSomething = function() {
      this.emit('done');
    };


    var foo = new ModuleA();
    foo.doSomething(); // => logs 'done'

To do this, we can use Node's `util.inherits`, which will in this case cause `ModuleA` to inherit from `EventEmitter`. Notice we can then call `this.on` and `this.emit` from within `ModuleA`. This is a nice pattern to use if you've got a module that's going to be firing a lot of events. You may chose to create your own EventEmitter object that extends Node's and adds some extra shared functionality relevant to the context of your application.

I highly encourage you to play with EventEmitters and the publish and subscribe pattern; once you're comfortable with it I find it's a great way to keep your code organised, decoupled and extensible with very little effort.



