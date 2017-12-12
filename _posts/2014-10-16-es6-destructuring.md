---
layout: post
title: ES6 Destructuring
intro: "Meet some more of ES6's new features: destructuring of arrays and objects"
---

ES6 comes both with huge new features like generators or classes, but also packs in a lot of smaller features that are going to make a big difference to how your JavaScript looks. Today I want to explore some of the new destructuring abilities ES6 adds, and how it can reduce the amount of code we have to write.

## Traceur
All the code examples seen in this post were run through [Traceur](https://github.com/google/traceur-compiler), a tool for compiling ES6 code into ES5 code which has much better browser support. The beauty of Traceur is that it allows you to write ES6, compile it and use the result in environments where ES6 features are not implemented. Traceur is installed through npm:

```sh
npm install --global traceur
```

And then used on a source file like so:

```sh
traceur --out build.js --script my_source_file.js
```

You'll also need to include the Traceur runtime in your HTML. The runtime comes as part of the Node module, and is found in the `bin` directory, called `traceur-runtime.js` directory. If you'd like to see an example of this, you can [check out this example repo on GitHub](https://github.com/javascript-playground/es6-classes), which has Traceur set up.

## Destructuring

The most common destructuring example is to pull values out of an array:

```js
var [a, b] = [1, 2];
a; //=> 1
b; //=> 2
```

You can also miss out parts of the array too:

```js
var [a, , b] = [1, 2, 3];
a; //=> 1
b; //=> 3
```

This lends itself well to splitting strings:

```js
var fullName = 'Jack Franklin';
var [first, last] = fullName.split(' ');
first; //=> 'Jack'
last; //=> 'Franklin'
```

What is perhaps more useful is that we can perform this same type of destructuring on objects:

```js
var { name, age } = { name: 'Jack', age: 22 };
name; //=> 'Jack'
age; //=> '22'
```

This is useful if you have a function that returns an object, and you want to get certain parts of the object only:

```js
var about = function() {
  return {
    name: 'Jack',
    age: 22,
  };
};

var { name } = about();
name; //=> 'Jack'
```

## Functions that take objects

The above functionality is really useful, and will certainly come in handy, but we can go one step further.

Because we can take in an object as the only argument to a function, we can destructure against that object.

```js
var someFunc = function({ name: name }) {
  console.log(name);
};

someFunc({ name: 'Jack' });
// 'Jack'
```

The above function takes in an object and destructures it, declaring that whatever is passed in as the `name` property of the object will then be available within the function as the `name` variable. Suddenly we can rewrite this type of code:

```js
var someFunc = function(opts) {
  var name = opts.name;
  console.log(name);
};

someFunc({ name: 'Jack' });
```

Into what we had earlier:

```js
var someFunc = function({ name: name }) {
  console.log(name);
};

someFunc({ name: 'Jack' });
```

This may take some getting used to in terms of reading the code, but it makes it much clearer what's going on. You can see exactly what the object expects.

We can even go one step further though. In ES6 we also have some nice sugar for declaring properties on objects where the value is already defined in a variable by the same name. What this means is that we can take this code block:

```js
var name = 'Jack';
return { name: name };
```

And rewrite it as:

```js
var name = 'Jack';
return { name };
```

When you have an object where the value of the property matches a variable of the same name, you can shorten it and only refer to it once, thus avoiding duplicating the same word twice. Taking that into account, our function from earlier:

```js
var someFunc = function({ name: name }) {
  console.log(name);
};

someFunc({ name: 'Jack' });
```

Becomes even more concise:

```js
var someFunc = function({ name }) {
  console.log(name);
};

someFunc({ name: 'Jack' });
```

## Conclusion

I hope I've shown you how ES6 destructuring can really clean up your code. It might take a while for you to get used to, and the syntax can look a little weird if you're not used to it, but once you're adjusted I think it really makes code but nicer to read and work with. It also makes code much more self documenting and clear in its intentions, in my opinion.
