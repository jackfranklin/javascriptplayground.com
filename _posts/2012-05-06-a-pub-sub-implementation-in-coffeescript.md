---
layout: post
title: "A Pub Sub implementation in CoffeeScript"
---

A while back I wrote about creating a [Pub/Sub implementation in jQuery](http://javascriptplayground.com/blog/2012/04/a-jquery-pub-sub-implementation) and said that I'd revist the subject without relying on jQuery. Today I'm going to do that but once again use [CoffeeScript](http://www.coffeescript.org). As always I will be Unit testing, this time with Mocha, the [same library I covered in the last tutorial](http://javascriptplayground.com/blog/2012/05/a-jquery-plugin-in-coffeescript). I will not be going over the very basics of using Mocha, so if you haven't used it before, please read that post first. Similarly, I will not be covering basic CoffeeScript, so please refer to that article if you're not familiar with the basics. For those not fans of CoffeeScript, in the future I'll be writing this from scratch with just JavaScript. The reason I use CoffeeScript today is that I've had a lot of requests for it, so I thought I'd merge a tutorial on "Advanced Coffeescript" into this Pub/Sub one.

The Pub/Sub pattern (also known as the Observer pattern) is simple:

1. You can subscribe to an event, and add a function to execute when that event is called.
2. You can publish events, invoking the functions of all the items subscribed to that event.

It's actually a very simple system to create. We'll be using CoffeeScript's class syntax to get this done. First however, I want to set up my testing. Create your `test/` and `src/` directories and add `pubsubtest.coffee` and `pubsub.coffee` to each of them respectively. Within your test file, add:
chai = require 'chai'
expect = chai.expect
{Pubsub} = require '../src/pubsub'
Remembering you need Mocha & Chai installed. Please see the previous tutorial I linked to above if you need to do this. Last time round I used Chai's `should` syntax to do tests, which are done more in the BDD style:

    someVal.should.equal "foo"

Today however I'm using Chai's `expect` syntax, which gives me TDD style tests such as:

    expect(someVal).to.equal "foo"

Personally I prefer the latter syntax, however use which ever one you prefer.
The last line includes my PubSub class, which we need to create before we do any more coding. Head into the source file and add:

    class Pubsub

    root = exports ? window
    root.Pubsub = Pubsub

That code creates our new class & exports it as `root.Pubsub`, so we can then get at it in our tests using `{Pubsub} = require('../src/pubsub.coffee')`.

The way this will work, is that the subscribe method should take three parameters, which are:

1. The id of the item subscribing to the event, such as "module_chat".
2. The event to subscribe to, such as "new_message".
3. The function to execute when that event is published.

I will store these in an object and then store all items that are subscribed to an event in an array, so my object might look like this:

    subs = {
    	event1: [
    		{ id: "module1", callback: function() {} },
    		{ id: "module2", callback: function() {} }
    	]
    }

So the next step is to write tests for these:

    describe 'a subscription', ->
      myApp = new Pubsub
      it 'should add subscriptions to the object', ->
        sub1 = myApp.sub "elem1", "myEvent", someFn
        expect(myApp.subs["myEvent"]).to.be.ok
        expect(myApp.subs["myEvent"].length).to.equal 1
      it 'it should add the id to the array for that event if the event already exists', ->
        sub2 = myApp.sub "elem2", "myEvent", someFn
        expect(myApp.subs["myEvent"].length).to.equal 2

The first spec says that when I add a new subscription, the object in `myApp`, called `subs`, should have a property in it called `myEvent`, and that should exist. The test `to.be.ok` checks it evaluates to true, which it will do unless it doesn't even exist. I then check the length of `subs["myEvent"]` to be one, which means there's just one item in the array, which should be correct, as we've only added one subscription for this event.

The second spec says that if we add another subscription for a new event, it should add the item to the array in `subs[myEvent]`, so the array should have a length of 2. I could write further tests which check the specific data within the array, but for now that will be okay. I'm actually going to follow this up looking at our tests & where we can improve them, but for now we will stick with some basic tests.

You can run these in the console with:

    mocha --compilers coffee:coffee-script -R spec

I append `-R spec` on there to get an "RSpec" style output in the terminal. Right now they all fail. First steps is to set up a constructor to create our `subs` object. I use `@subs` here because in CoffeeScript, `@` is a shortcut for `this`. So `@subs` is `this.subs`:
class Pubsub
constructor: ->
@subs = {}
When I started implementing the `sub` method, I decided to write a function to check if an event has any subscriptions or not, as it made sense. I denote this as `_isSubscribed`, with the underscore denoting to me that it's not a method I expect anyone to use outside of the implementation. These are what I usually refer to as utility functions:

    _isSubscribed: (evt) ->
    	@subs[evt]?

All we do is see if the key exists. Using CoffeeScript's existential operator `?` we can check if a variable is defined & not null. This is a really useful feature which I use a lot.

You may say you could just do `@subs[evt]?` wherever you need it, but I like to pull that out into a method as I'm sure I will need it lots. Perhaps you would rather not, but I like it, personally. But I don't like having methods - albeit very simple ones - without tests, so in this case I tend to retrospectively write tests to double check my implementation:
describe 'isSubscribed', ->
myApp = new Pubsub
it 'should return false if evt is not in subs', ->
expect(myApp.\_isSubscribed("event1")).to.equal false
myApp.sub "elem2", "myEvent", someFn
expect(myApp.\_isSubscribed("event1")).to.equal false
it 'should return true if evt is in subs', ->
sub1 = myApp.sub "elem1", "myEvent", someFn
expect(myApp.\_isSubscribed("myEvent")).to.equal true

It's pretty simple, I just add some subscriptions, and check that it returns true or false correctly. Of course, this is tough to test without the `sub` method being implemented, so here goes:
sub: (id, evt, cb) ->
if @\_isSubscribed evt
sub = @subs[evt]
sub.push {id: id, callback: cb}
else
@subs[evt] = [{id: id, callback: cb}]

The implementation is pretty simple:

1. If the event already has a subscription, then add a new object to the subscription array for that event.
2. Else, create a new object & add an array of just one object.

If you run those tests now, we should be passing. The next thing I want to do is add a way to unsubscribe. Again, time for tests!
describe 'unsubscribing', ->
myApp = new Pubsub
it 'should not error if removing a non existant subscription', ->
myApp.unSub "elem1", "myEvent"
expect(myApp.subs).to.eql {}
it 'should remove subscription fine', ->
myApp.sub "elem1", "myEvent", someFn
myApp.sub "elem1", "myEvent2", someFn
expect(myApp.subs["myEvent"]).to.be.ok
myApp.unSub "elem1", "myEvent"
expect(myApp.subs["myEvent"]).to.not.be.ok
expect(myApp.subs["myEvent2"]).to.be.ok

The only line I want to highlight:

    expect(myApp.subs).to.eql {}

You'll notice I use `eql` here rather than `equal`. This is because `equal` tests strict equality, whilst `eql` does not. In JavaScript:

    {} === {} //false
    {} == {} //true

So to check if my object is empty, I want to use `==`, which is what `eql` does. My implementation for `unSub` is:
unSub: (id, evt) ->
return false if not @\_isSubscribed evt
newSubs = []
for sub in @subs[evt]
newSubs.push sub if sub.id isnt id
if newSubs.length is 0
delete @subs[evt]
else
@subs[evt] = newSubs

This works like so:

1. If `subs[evt]` does not exist, we don't need to bother trying to unsubscribe as there cannot be something to unsubscribe from.
2. Else, we loop through all subscriptions for that event, and add any that are not the one we want to remove to the new array, `newSubs`. Then, if `newSubs` contains items, we set `@subs[evt]` to be the new array, else we remove it.

Notice how I'm adding the conditional after the `return false`. You can do this with all conditionals in CoffeeScript. You see I do it again in the line `newSubs.push sub if sub.id isnt id`. I find for quick, one line conditionals, postfixing the conditional makes more sense to me. I also use `is`, which is compiled into `===`. If you try using `===` in your CoffeeScript, it wont compile, however if you use `==`, it will compile into `===`.

Now we pass the tests for that, lets write the tests for publishing events. I stumbled a bit here, as I wasn't sure how best to check events had been fired. I came up with a system for doing this:

Create my test functions to set a variable to true, and then create a function to check if that variable is true or false. If it's true, reset it to false, ready for the next test, and return true. If it's not true, return false.
fnDidFire = false
hasFired = ->
if fnDidFire
fnDidFire = false
return true
else
return false
someFn = ->
fnDidFire = true

I also want to be able to pass data to callbacks, so I need to write another test variable & function to check I'm passing in the extra information.

    extraCallbackInfo = {}
    someFnWithInfo = (info) ->
     fnDidFire = true
     extraCallbackInfo = info


When I want to test passing data, I will use the function which sets `extraCallbackInfo` and then I'll test on that.

So we can test the result of `hasFired()`, and if that's true, we can be confident the function fired. Using this, I can write my tests:

    describe 'a publish', ->
      myApp = new Pubsub
      myApp.sub "elem1", "event1", someFn
      it 'should fire the callback', ->
        myApp.pub "event1"
        expect(hasFired()).to.be.ok

      it 'should send any extra data through with the callback', ->
        myApp.sub "elem2", "event2", someFnWithInfo
        myApp.pub "event2", foo: "bar"
        expect(hasFired()).to.be.ok
        expect(extraCallbackInfo.foo).to.equal "bar"

      it 'should not fire for an event that does not exist', ->
        myApp.pub "madeUpEvent"
        expect(hasFired()).to.not.be.ok

The implementation for this is actually very, very simple:

    pub: (evt, info) ->
      for key, val of @subs
        return false if not val?
        if key is evt
          for data in val
            data.callback(info)

1. If `val` does not exist, don't do anything.
2. Else, if `key` is `evt`, which means we have a match, loop through every item in the subscription array for that value.
3. Then, run the callback, passing in the extra data passed.

With that, you should see a passing set of specs. It's only a very simple implementation, but there is certainly room for improvements, both in the tests & implementation. If you'd like to check it out, [it's on Github](https://github.com/jackfranklin/CoffeePubSub) for you to play around with.
