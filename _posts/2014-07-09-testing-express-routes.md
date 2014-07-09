---
layout: post
title: Unit testing ExpressJS route functions
intro: In this post we'll look at how to unit test API endpoints within an Express 4 application.
---

I've recently been working on an application which has two distinct parts: an Angular front-end, and an API powered by ExpressJS. Something I was keen to do from the beginning was to look at how I could test these API endpoints - not through an integration test, where we fire up the app and make sure hitting an endpoint gives back a response, but through isolated unit tests, where we test the inputs and outputs of the endpoint functions.

A typical route function in my application looks something like:

```js
app.get('/', function(req, res) {
    res.json({ my: 'response' });
});
```

The steps to being able to test this are:

- Define each route's function eslewhere, and then pass it into an `app.get` call later. This lets us have access to the route function isolated from Express.
- Because all of my responses call `res.json`, in our tests we will need to fake the method. We can pass in a method called `json`, so the code will work, but in there we can add our own implementation that will test the JSON response is what we expect.

I like to split my routes up into different files, one for each grouping of endpoints. For example, the below code contains routes that will be used under the `/users` endpoint. This is a good example of how I like to define my routes - completely independent of the Express framework.

```js
var userRoutes = {
  '/': {
    method: 'get',
    fn: function(req, res) {
      res.json({ foo: 'hello world' });
    }
  }
};

module.exports = userRoutes;
```

To test this, all we need to do is call the `fn` method of the `/` object within `userRoutes`. We can pass in fake arguments to this function when we call it, and provide our own fake `json` method which we can then make assertions on. By doing this we avoid having to load Express, or anything else. This is a big deal - as your app gets larger, loading it will take longer. Being able to test your components in isolation, away from your framework, helps keep test suites quick, which is vital to a good development workflow.

Let's see this in action. Here I'm using Mocha for `describe` and `it`, and I'm using the [expect.js](https://github.com/LearnBoost/expect.js/) library for my expectations. 

```js
var expect = require('expect.js');
var userRoutes = require('../../routes/users');

describe('user routes', function() {
  describe('index', function() {
    it('returns hello world', function() {
      userRoutes['/'].fn({}, {
        json: function(data) {
          expect(data).to.eql({ foo: 'hello world' });
        }
      });
    });
  });
});
```

The key bit of that is this section:

```js
userRoutes['/'].fn({}, {
  json: function(data) {
    expect(data).to.eql({ foo: 'hello world' });
  }
});
```

Here we call the function, passing in an empty object for the request (if we needed to we could easily pass in fake data, if the function used the request object at all) and a fake `json` method as part of the resonse object. The function under test calls this `json` method, passing in the data we want to return. Hence, within the body of our fake `json` method, we can define the expectation we're after, and check that the data the function returns matches what we expect.

If you take just one thing away from this post, isolate your code from your framework as much as possible. Yes, it means a little more work to wire things up, but the speed gains from doing so really pay off, particularly as your app grows.

PS - recently I've created a JSPlayground Twitter account, so if you'd like to be aware when new posts get released, the best way to do so is to [follow the site on Twitter](http://twitter.com/jsplayground_).



