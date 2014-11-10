---
layout: post
title: JavaScript Modules and Dependencies with jspm
intro: In this post I'll show you how to manage your application's dependencies and structure it using JSPM.
---

[jspm](http://jspm.io/) is a package manager for JavaScript applications that sits on top of the [SystemJS](https://github.com/systemjs/systemjs). Both were written and are maintained by [Guy Bedford](http://twitter.com/guybedford). SystemJS builds on top of the [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader) and adds the capability to load in modules that are defined using a variety of syntaxes:

- CommonJS (for example, NodeJS modules)
- AMD (the spec that RequireJS follows)
- ES6 modules (using the [ES6 module loader](https://github.com/ModuleLoader/es6-module-loader) and [Traceur](https://github.com/google/traceur-compiler).
- Modules that export a global variable are also supported via a shim config.

I think that ES6 modules are absolutely fantastic, and at [GoCardless](http://www.gocardless.com), we've structured a large JS heavy application using SystemJS, allowing us to manage our application's modules entirely through ES6. Using jspm is the next logical step up from SystemJS. It manages our dependencies, lets us install third party ones and comes with tooling to build applications into one file for production.

Today we will set up a very simple project using jspm, and in further posts we will explore more of its features.

## Installing jspm

jspm should be installed as a global tool through npm:

```sh
npm install --global jspm
```

Let's create a new project. Create a new directory and run `jspm install`. The CLI will ask you a set of questions about your project, which you should answer. If the default answer is fine, you can just hit enter to continue onto the next question. Once the prompts have been answered, jspm is going to perform the following tasks:

- create a `config.js`, which contains the configuration for your modules. We will look at this in more depth shortly.
- create a `package.json` file for your project. jspm stores your project's dependencies in here, under the `jspm` key by default.
- Download some libraries that jspm needs: SystemJS, the es6-module-loader, Traceur and the Traceur runtime.

## Running the App

To get this running we now need to create an HTML file, and load in a couple of scripts. Create `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      System.import('./app');
    </script>
  </head>
  <body>
  </body>
</html>
```

We first load in the SystemJS source, and then the `config.js`, which jspm created for us. Then we can use `System.import`, the proposed browser loader API for dynamically loading ES6 modules, polyfilled by the es6-module-loader, to import the file `app.js`:

```js
console.log('hello world');
```

If you run the app locally (I recommend the npm module [serve](https://www.npmjs.org/package/serve) for this), you should be able to visit `index.html` and see 'hello world' logged.

## Installing Dependencies

So far, jspm hasn't added much to the party. Most of the work to achieve what we have has been done by SystemJS. Let's say that your application requires jQuery for some piece of functionality. jspm will let us install modules from either GitHub or from npm, and jQuery is available on both, so we're good there. There is also a small [registry](https://github.com/jspm/registry/blob/master/registry.json) maintained for popular dependencies, and jQuery is one of them. Because of this, we can just run `jspm install jquery`, and jspm will know how to resolve "jquery" into the right files to download. Run that now and see what happens:

```sh
> jspm install jquery

     Updating registry cache...

     Looking up github:components/jquery
ok   Installed jquery as github:components/jquery@^2.1.1 (2.1.1)

ok   Install complete
```

jspm has searched its registry for "jquery", and found that it is mapped to "github:components/jquery", and has gone and installed jQuery from that repository. Additionally, it has added jQuery to the `package.json`, which means if you were to clone the repository and run `jspm install`, jQuery will be downloaded and installed for you.

If we take a look at `config.js`, we can see jspm has modified it:


```js
System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "jquery": "github:components/jquery@^2.1.1"
  }
});

System.config({
  "versions": {
    "github:components/jquery": "2.1.1"
  }
});
```

These paths and mappings tell SystemJS how to resolve a request for a module. Most of the time jspm will generate this for you and you won't have to edit it too much, however sometimes it can be useful to map a longer package name to a smaller one, as jspm has done with jQuery. You can actually generate these mappings automatically when you install a module:

```sh
jspm install j=jquery
```

Would install jQuery and set up a path so in your code you could load it in as `j`. I don't recommend using such short names, but in some cases it can be useful to save on typing.

Now we can use jQuery in our application. Head back to `app.js` and load it in:


```js
var $ = require('jquery');

console.log($.fn.jquery);
```

Remember, SystemJS can deal with modules defined and loaded in using either AMD, CommonJS or ES6 modules. Here I've chosen to use the CommonJS style just to show that it works. If you now run this in your browser, you will see `2.1.1` logged to the console - `$.fn.jquery` returns the current version of jQuery running.

## Installing a dependency from npm

Let's now look at installing something from npm, namely [LoDash](http://lodash.com/). Typically, if a dependency you need is on npm, you should install it from there rather than on GitHub. We can install it with jspm like so:

```
> jspm install npm:lodash


Updating registry cache...
Looking up npm:lodash
Looking up github:jspm/nodelibs
Looking up npm:Base64
Looking up npm:base64-js
Looking up npm:ieee754
Looking up npm:inherits
Looking up npm:pbkdf2-compat
Looking up npm:ripemd160
Looking up npm:sha.js
ok   Installed github:jspm/nodelibs@0.0.5 (0.0.5)
ok   Installed lodash as npm:lodash@^2.4.1 (2.4.1)

ok   Install complete
```

Don't worry that a lot of extra files got downloaded - these are dependencies that jspm has in order to install npm modules correctly.

Now head into `app.js` and load in LoDash.

```js
var $ = require('jquery');
var _ = require('lodash');

console.log($.fn.jquery);
console.log(_.VERSION);
```

You will see the current version of LoDash (`2.4.1` at time of writing) in the console.

## ES6 Syntax

To round off this tutorial, let's swap to using the ES6 module syntax:

```js
import $ from 'jquery';
import _ from 'lodash'

console.log($.fn.jquery);
console.log(_.VERSION);
```

If you load your browser again, you'll see that everything still works. If you need a primer on the ES6 module syntax, I covered it [previously on the site](http://javascriptplayground.com/blog/2014/06/es6-modules-today/).

## Advantages over RequireJS or Browserify

This approach of jspm + SystemJS offers a number of advantages over other solutions such as Require or Browserify. With RequireJS, you have to install it through a tool such as Bower, but then manage the mappings and namings of the modules manually. With jspm, you very rarely have to edit the configuration, it is just done for you. In the cases where jspm isn't able to do it all for you, you can manually override and add to the jspm registry, fixing the problem for you and for others.

The primary benefit over Browserify is that you do not need any form of build tool or task running all the time every time you change a file. Because it's all run and compiled (in development, anyway), in the browser, there's much less tooling or set up required. Compilation through Traceur for your ES6 files is all done for you.

## Conclusion

The combination of jspm and SystemJS is a powerful one, in particular when combined with the new module syntax in ES6. In future tutorials we will look more at structuring applications and defining your own modules and use jspm to bundle our application into one file that can be used in production.

Thank you to [Guy Bedford](http://twitter.com/guybedford), [Oliver Ash](http://twitter.com/oliverjash) and [Sebastien Cevey](http://twitter.com/theefer) for their time spent reviewing this blog post.
