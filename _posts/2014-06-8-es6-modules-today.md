---
layout: post
title: Using ES6 Modules Today
intro: Continuing our theme of exploring ES6, today we'll use the Square ES6 transpiler to use the ES6 modules syntax in our applications today.
---

Continuing with the theme of playing with new features of ES6, today we're going to look at how we can use the new ES6 module syntax today, using Square's [ES6 Module Transpiler](https://github.com/square/es6-module-transpiler). **Remember, this syntax is not set in stone yet and could change**, but that's no reason to not have a play with the new syntax today.

The transpiler takes the JavaScript and transpiles it into either the CommonJS format (which is what NodeJS uses) or AMD (using RequireJS). This means you write your code using the ES6 syntax, and then run it with CommonJS, RequireJS, or similar.

It's easier to show with an example. Let's make `adder.js`, which has a multiplier function:

```js
var multiplier = function(x) {
  return function(y) {
    return x * y;
  };
};

export { multiplier };
```

The `multiplier` function takes an argument and returns a function that will multiply its argument by the initial argument. So `multiplier(2)(2)` will return `4`, and `multiplier(2)(4)` gives us `8`.

Notice the last line of the function:

```js
export { multiplier };
```

This uses the new ES6 syntax to export the `multiplier` function from this file.

Now let's write a second file, `app.js`, and use our `adder` module:

```js
import { multiplier } from './adder';

var timesTwo = multiplier(2);

console.log(timesTwo(4));
```

Again, pay particular attention to the top line:

```js
import { multiplier } from './adder';
```

This is how we import exported objects from modules using the ES6 syntax.

To run this code, first we need to compile it. Firstly, install the ES6 transpiler:

```
npm install -g es6-module-transpiler
```

Now we can transpile it. For this example, as we want to run the resulting code through Node, we will tell the transpiler to use the CommonJS syntax:

```
compile-modules app.js adder.js --to compiled --type cjs
```

This instructs the transpiler to transpile `app.js` and `adder.js` into the `compiled` directory.

Let's take a look at `compiled/adder.js`:

```js
'use strict';
var multiplier = function(x) {
  return function(y) {
    return x * y;
  };
};

exports.multiplier = multiplier;
```

Notice how it has updated the exports code to the CommonJS style.

Now let's check `compiled/app.js`:

```js
'use strict';
var multiplier = require('./adder').multiplier;

var timesTwo = multiplier(2);

console.log(timesTwo(4));
```

Once again, the import has been changed into a standard CommonJS `require` call.

Now we can run `node compiled/app.js` and get `8` as our output. It worked!

Let's see what the output would be if we chose AMD support instead. Try running:

```
compile-modules app.js adder.js --to compiled --type amd
```

Now, `compiled/adder.js` looks like so:

```js
define(['exports'], function(__exports__) {
  'use strict';
  var multiplier = function(x) {
    return function(y) {
      return x * y;
    };
  };

  __exports__.multiplier = multiplier;
});
```

And `compiled/app.js` looks like this:

```js
define(['./adder'], function(__dependency1__) {
  'use strict';
  var multiplier = __dependency1__.multiplier;

  var timesTwo = multiplier(2);

  console.log(timesTwo(4));
});
```

If we were to setup RequireJS and require `app.js`, this would work just fine in a browser.

If you're not a fan of running the transpiler directly, you can find both [Grunt](https://github.com/joefiorini/grunt-es6-module-transpiler) and [Gulp](https://github.com/ryanseddon/gulp-es6-module-transpiler) plugins. I highly recommend having a play and exploring the module syntax - we've not covered it all in this post and seeing as it will be standard fairly soon, it makes sense to be familiar with it.
