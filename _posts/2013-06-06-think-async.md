---
published: false
layout: default
---

# Think Async

Humans are no good a multitasking, with things going on all over the place. We deal with just one thing at a time and I'm glad, becuase do you remember the last time you tried to have a bath, browse Facebook and perform open heart surgery? I do, and it didn't end well. People were very cross.

Unfortunately – or perhaps fortunately – humans brains don't run on Javascript, becuase if we did we'd have access to the topic of this article: **async**, a library  by Caolan McMahon that helps you write asynchronous code.

By the way, to get something out of this article I'd say that you need some experience with [Node.js](http://nodejs.org), and the ES5 array methods like `forEach` and `map`. They all feature heavily in this article, but in a more complicated form than you might be used to!

You can [download the files](http://i.phuu.net/OkuP) for this article and view the [async documentation on GitHub](https://github.com/caolan/async#asyncjs).

## Callbacks & errors

Before we jump into code and start getting mucky with async, I'd like to talk about callbacks. A convention in Node is that callbacks are used in the following way:

```javascript
doSomething(aThing, function (err, newThing) {
  // . . .
});
```

Notice that the callback function takes two arguments, `err` and `newThing`. The convention is that the first argument to the callback is be an error, and if there's no error it's `null`. All the other arguments are the result of the asynchronous action.

This convention means you'll often see error-handling code like the following:

```javascript
doSomething(aThing, function (err, newThing) {
  if (err) return handleError(err);
  // . . .
});
```

In the case of an error, your callback will stop execution immediately to handle it.

This error convention is very consistent across Node libraries at least, and some browser libraries, meaning you can be fairly confident that a new library you're using will conform to it.

The other convention here is that the callback is the last argument to the `doSomething` function. In most cases you'll use callbacks in the same way.

It's important to know about these conventions because we'll be seeing them alot more as we go on.

## Introducing async

Async is a tool for your Javascript utility belt that helps you out with the asynchronous tasks that are so often found in Node.js, and in the browser too. It gives you methods like `series`, `parallel` and `map`, all designed around asynchronous functions and callbacks, to make your life easier.

(I love it so much that often the first two things I add to a Node project are [underscore](http://underscorejs.org/) and async.)

Async is available for Node projects via npm, and you can find it [on cdnjs](http://cdnjs.com/#async) for the browser.

With npm that's `npm install async`.

In HTML you can do: `<script src="//cdnjs.cloudflare.com/ajax/libs/async/0.2.7/async.min.js"></script>`.

Lovely!

## A small example

To show the idea, here's a small async example using Node which we'll build it up to be more useful. I've saved it as `example-1.js` in the [code examples](http://i.phuu.net/OkuP).

```javascript
var async = require('async');

var square = function (num, doneCallback) {
  console.log(num * num);
  // Nothing went wrong, so callback with a null error.
  return doneCallback(null);
};

// Square each number in the array [1, 2, 3, 4]
async.each([1, 2, 3, 4], square, function (err) {
  // Square has been called on each of the numbers
  // so we're now done!
  console.log("Finished!");
});
```

Running this file with Node gives us:

```shell
$ node example-1.js
1
4
9
16
Finished!
```

So what's going on with `async.each`?

The first argument is an array of items to be iterated over.

The second argument is the **iterator** function – in this case, that's `square`. With `async.each` the interator takes two arguments - the current **item** and a **done callback**. The iterator can do what it likes to the item so long as it calls the done callback at some point, with or without an error.

The last argument to `async.each` is the **finished callback**, which is only called when the done callback has been called for every item in the array.

The important thing to note is that async ensures that the finished callback is called **only when the iterators are done**. That's what a lot of async is all about – manging asynchronous tasks carried out on arrays.

## Getting values back

But wait... "Bah!" I hear you cry, "that's no use to me!"

You're so right. The above example isn't much use – the finished callback doesnt't get at the values generated from `square`, which is pretty pointless if you ask me. But fear not, for we have `async.map` at our disposal. This is `example-2.js`.

```javascript
var async = require('async');

var square = function (num, doneCallback) {
  // Call back with no error and the result of num * num
  return doneCallback(null, num * num);
};

// Square each number in the array [1, 2, 3, 4]
async.map([1, 2, 3, 4], square, function (err, results) {
  // Square has been called on each of the numbers
  // so we're now done!
  console.log("Finished!");
  console.log(results);
});
```

The output of this file is as follows:

```shell
$ node example-2.js
Finished!
[ 1, 4, 9, 16 ]
```

So the finished callback now gets passed an array of the results of the iterator. Great!

So what changed to make this happen?

First, we're using `async.map`, which sets async up to support returning results as an array. This is similar to Javascript's `Array.map`.

Next, the iterator (`square`) is passing `num * num` as the second argument to the done callback. Async is expecting it, and saves the value in an array, maintaining the order that the list was originally in.

Finally, the finished callback now expects two arguments. The new one is `results`, which is the array of the squared values.

## Asynchronising

So far we've actually cheated and use an iterator function that isn't *actually* asynchronous – it just calls the `doneCallback` straight away without doing any work. Lazy.

To demonstrate the that the iterator can really be asynchronous, I've put togther an example where the squaring takes a random amount of time. It's `example-3.js`.

```javascript
var async = require('async');

var square = function (num, doneCallback) {
  setTimeout(function () {
    console.log('Squaring', num);
    // A random amount of time has passed.
    // Callback with no error and the result of num * num
    return doneCallback(null, num * num);
  }, 4000 * Math.random());
};

// Square each number in the array [1, 2, 3, 4]
async.map([1, 2, 3, 4], square, function (err, results) {
  // Square has been called on each of the numbers
  // so we're now done!
  console.log("Finished!");
  console.log(results);
});

// Becuase the callbacks are asynchronous, this line
// is called before the finished callback.
console.log("This line happens first!");
```

Running this example will give you a slightly different output every time, but it'll look something like this:

```shell
$ node example-3.js
This line happens first!
Squaring 4
Squaring 2
Squaring 3
Squaring 1
Finished!
[ 1, 4, 9, 16 ]
```

The comments explan this example but just notice that, although the square happens in a random order, the results come out in the right order. Async is handling that for us. How nice of it.

## Real-world example

Asynchronously squaring small numbers isn't particularly useful, but what about something that is...

Let's say you're building a file size tool. You want to use Node's filesystem module (`fs`) to grab the names and sizes of each of the files in the current directory, and list them in order.

With Node, that can be a bit tricky. Luckily, we've got async up are code, uh, sleeves.

First, let's grab the names of the children of the current directory. This is `files-1.js`.

```javascript
var async = require('async'),
    fs = require('fs');

fs.readdir(process.cwd(), function (err, files) {
  console.log('Found', files);
});
```

This gives us:

```shell
$ node example-4.js
Found [ 'example-1.js',
  'example-2.js',
  'example-3.js',
  'example-4.js',
  'node_modules' ]
```

To get the file sizes we run `fs.stat` on each of the file names. This uses `async.map` that we saw earlier, and you can find it in `files-2.js`.

```javascript
var async = require('async'),
    fs = require('fs');

fs.readdir(process.cwd(), function (err, files) {
  async.map(files, fs.stat, function (err, stats) {
    console.log(stats);
  });
});
```

This works becuase `fs.stat` takes the file path and a callback as a parameter. That's is exactly what `async.map` gives it, so it knows to call the callback with an error, or the data it collects.

The (reduced) output looks something like this:

```shell
$ node files-1.js
[ { dev: 16777219,
    mode: 33188,
    nlink: 1,
    ... },
  { dev: 16777219,
    mode: 33188,
    nlink: 1,
    ... } ]
```
 
Things don't need to be asynchrous now – we've got all the information we need. We  use each of these stats objects to determine if the file is indeed a file, then filter out the other children and display a size-ordered list of the files. Simples. This is `files-3.js`.
 
```javascript
var async = require('async'),
    fs = require('fs');

fs.readdir(process.cwd(), function (err, children) {
  async.map(children, fs.stat, function (err, stats) {
    stats
      // Make sure this is a file. If it isn't, return (undefined).
      // Convert the file stat to an object with name and stat info
      .map(function (stat, index) {
        if (!stat.isFile()) return;
        return {
          name: children[index],
          stat: stat
        };
      })
      // Filter out the undefined (and unwanted) values
      .filter(function (val) { return !!val; })
      // Sort the remaining files by size, using the stat object
      .sort(function (a, b) { return a.stat.size - b.stat.size; })
      // Reverse the array so it's descending
      .reverse()
      // And list 'em out
      .forEach(function (file) {
        console.log('%dB : %s', file.stat.size, file.name);
      });
  });
});
```

The output might look something like this:

```shell
$ node files-3.js
908B : files-3.js
686B : example-3.js
412B : example-2.js
218B : example-1.js
200B : files-2.js
139B : files-1.js
```

Neat!

## This is just the beginning...

There's much, *much* more to async than I've covered here, but hopefully I've got you thinking about asynchronous problems and given you an insight into how to deal with them. They can be tricky to get your head around at first, but remember that code is read many more times than it is written, so comment your code well. Your future self will thank you.

You can [download the files](http://i.phuu.net/OkuP) for this article and view the [async documentation on GitHub](https://github.com/caolan/async#asyncjs), and if you have any questions find me on Twitter [@phuunet](http://twitter.com/phuunet).
