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

