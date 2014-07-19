---
layout: post
title: Real Life ES6 - Classes
intro: Today we'll look at another new feature of ES6, classes.
---

## Support

ES6 support is mixed across platforms, so you shouldn't expect to start using this stuff today. Implementations are being added all the time, and I recommend using [The ES6 Compatability Table](http://kangax.github.io/es5-compat-table/es6/) to see the current state of affairs.

## Traceur

All the code examples seen in this post were run through [Traceur](https://github.com/google/traceur-compiler), a tool for compiling ES6 code into ES5 code which has a much better browser support at this time. It allows you to write ES6, compile it and use the result in environments where ES6 features are not implemented. Traceur is installed through npm:

```sh
npm install --global traceur
```

And then used on a source file like so:

```sh
traceur --out build.js --script my_source_file.js
```

You'll also need to include the Traceur runtime in your HTML. The runtime comes as part of the Node module, and is found in the `bin` directory, called `traceur-runtime.js` directory. If you'd like to see an example of this, you can [check out the sample repo on GitHub](https://github.com/javascript-playground/es6-classes).

## Classes

The first thing to note is that classes are purely syntactical sugar over objects and prototypes that we're used to working with. They simply offer a much nicer, cleaner and clearer syntax for creating these objects and dealing with inheritance.

To show this in action we're going to build our own small (and very simplified) framework for building web applications to serve as a very basic example of using classes. It's going to have two classes, one to represent a view, and another to represent a model. Here's the `View` class:

```js
class View {
  constructor(options) {
    this.model = options.model;
    this.template = options.template;
  }

  render() {
    return _.template(this.template, this.model.toObject());
  }
}
```

Notice how we still set properties through `this.property`, but defining methods on the class is done very differently to how you might be used to. Not a `function` keyword in sight! Functions are defined by putting their name, followed by any arguments within brackets, and then a set of braces. That's it. Our view class is very simple, and provides just a simple `render()` method, which takes the template (I'm using Underscore here for templating) and the model object and then returns the compiled template.

```js
class Model {
  constructor(properties) {
    this.properties = properties;
  }

  toObject() {
    return this.properties;
  }
}
```

Our `Model` class is equally as simple. It stores all the properties and provides the `toObject` method that gives access to the properties.

We can now use these to output some HTML:

```js
var jack = new Model({
  name: 'jack'
});

var view = new View({
  model: jack,
  template: 'Hello, <%= name %>'
});

console.log(view.render());
```

The classes are insantiated just as they are in the ES5 and below world, with the `new` keyword used. The `constructor` function is called automatically when an instance of the class is created.

If you run the above code (remembering to run it through Traceur), you'll see `"Hello, jack"` outputted to the console.

## Extending

Say we have some views where we actually just want the `render` method not to return the compiled template, but to simply just `console.log` it. (This is a contrived example, but stick with me!). We might call this view `LogView`, and we can implement it by extending our regular `View` class:

```js
class LogView extends View {
  render() {
    var compiled = super();
    console.log(compiled);
  }
}
```

We use the `extends` keyword to extend another class. This means `LogView` inherits everything that `View` has. If we were to just have:

```js
class LogView extends View {
}
```

Then `LogView` functionality would be effectively identical to `View`.

Instead though, we override the `render` method:

```js
render() {
  var compiled = super();
  console.log(compiled);
}
```

We first call `super()`. This calls the parent class' method, and returns the result. This means that the `render` method on the `View` class is first called, and the result is stored in the `compiled` variable. We then simply log out the result.

```js
var jack = new Model({
  name: 'jack'
});

var view = new LogView({
  model: jack,
  template: 'Hello, <%= name %>'
});

view.render();
```

If you rerun Traceur and refresh the browser, you'll still see `Hello, jack` logged to the browser, but this time the only `console.log` call was from within the `LogView` class.

## Conclusion

I hope that serves as a nice introduction to ES6 classes. Just because they exist, it doesn't mean that you should immediately seek to change every object in your system to classes, but they certainly have some great use cases.

The code I used in this post is [on GitHub](https://github.com/javascript-playground/es6-classes), so feel free to check it out and have a play around.


