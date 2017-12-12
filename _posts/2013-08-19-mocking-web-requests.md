---
layout: post
title: Mocking API Requests in Node tests
intro: How to test Node modules that make lots of API requests.
---

Recently I sat down with my [Pulldown Project](https://github.com/jackfranklin/pulldown), aiming to rewrite the tests. The problem with them was that they were network dependent. Each test would hit the real API and download the real file. This was not good for a number of reasons:

* I couldn't run the tests without an internet connection
* the tests were slow
* the tests were unreliable, they would sometimes pass, and other times not

Unreliable tests are worse than no tests, so I ripped them out and started again.

### Meet Nock

The solution to this is [Nock](https://github.com/flatiron/nock), a Node module for mocking HTTP requests. With Nock you can mock a HTTP request and make it always return a specific result. Here's an example:

    var nock = require("nock");
    var http = require("http");

    var api = nock("http://javascriptplayground.com")
              .get("/test/")
              .reply(200, "Hello World");

    http.get("http://javascriptplayground.com/test/", function(resp) {
      var str = "";
      resp.on("data", function(data) { str += data; });
      resp.on("end", function() {
        console.log("Got Result: ", str);
      });
    });

In that code we do two things. First, we mock a request to `http://javascriptplayground.com/test/` and make it return the string "Hello World" with a 200 status code. Then we use Node's http library to make a request and log it out. We then get "Got Result: Hello World" outputted when we run the above.

What's so great about this is that `http.get` is none-the-wiser about what just happened. You don't have to change any code to make this work, just mock the request.

There's no requirement to return a string, either. You can return an object, an array, whatever you'd like.

### A Gotcha

When you mock something using nock, _it only works once_. Once a URL you've mocked is hit, the mock is then destroyed. To fix this, you can make a specific mocked URL persist:

    var api = nock("http://javascriptplayground.com")
              .persist()
              .get("/test/")
              .reply(200, "Hello World");

Now it will last forever, until you call `cleanUp`, which I'll cover shortly.

### Asserting

If you need to test thaat a specific URL is called, you can mock that URL and then call `isDone()` to see if it got called:

    var api = nock("http://javascriptplayground.com")
              .get("/test/")
              .reply(200, "Hello World");

    // http.get code here
    api.isDone(); // => true

### Clean Up

When you have lots of tests that do this, it's important to make sure they tidy up after themselves. The best way I've found of doing this is calling `nock.cleanAll()` after each test. `cleanAll()` removes all mocks completely. If you were using something like Mocha to do your tests, you might like to do this in the `afterEach` method.

### Further Reading

The best place to start is the [nock README](https://github.com/flatiron/nock). There's a huge amount of documentation and a lot more nock can do that I've not covered.

If you'd like to see a real project that uses nock, we use it extensively in the [Pulldown tests](https://github.com/jackfranklin/pulldown/tree/master/test).

If you've ever used an alternative to Nock, or use other tools with it that you think I should mention here, please leave a comment.
