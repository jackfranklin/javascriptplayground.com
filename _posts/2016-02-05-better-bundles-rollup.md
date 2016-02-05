---
layout: post
title: Better bundles with Rollup
intro: In this post we'll play with Rollup, a new bundling tool that can eliminate dead code and produce smaller bundles.
---

Recently I've been hearing a lot about [Rollup](https://github.com/rollup/rollup), a new JavaScript bundling tool that aims to produce smaller bundling sizes through _tree shaking_, which is the process of taking an application and figuring out which code is actually used.

Sam Saccone's [cost of transpiling ES2015](https://github.com/samccone/The-cost-of-transpiling-es2015-in-2016) repository also peaked my interest by comparing bundle sizes of popular bundling solutions. Rollup performed well in it and I was keen to give it a go!

## What is Tree Shaking?

A bundler that supports tree shaking will "shake" your application when it bundles it to see which code is actually used. Think of this like shaking a tree branch and seeing which leaves stay on it. This is most effective when you're depending on a huge library, Lodash for example, but only use one or two of the methods in it. A bundling tool that can calculate which parts of the library are used and only include them will cut out the vast majority of the library, which is unused. With a large application that includes many 3rd party dependencies we can dramatically reduce the size of our bundle we ship to users.

## Isn't this dead code elimination?

There's a subtle difference that the [rollup README](https://github.com/rollup/rollup) notes:

> Rather than excluding dead code, we should be including live code (aka 'tree-shaking'). That's only possible with ES6 modules.

## ES2015 Modules required

We need our application to be written in ES2015 modules because they allow us to only import parts of a module. That is, rather than:

```javascript
var each = require('lodash').each;
```

Which requires the entire module to be loaded, we can instead in ES2015 say:

```javascript
import { each } from 'lodash';
```

ES2015 modules are _static_, which means that their imports and exports are known without having to run the application. For example, the following isn't allowed in an ES2015 module:

```javascript
if (something) {
  export const foo = 2;
}
```

Rollup is able to parse your ES2015 application and its dependencies and eliminate any code that isn't used.

## ES2015 TodoMVC

To demonstrate this in action I took the [vanilla ES6 TodoMVC example](https://github.com/tastejs/todomvc/tree/gh-pages/examples/vanilla-es6) as a base. To be clear, this is not a criticism of this project, it's well written and a great example ES2015 application. I picked it because it was a good sized project to experiment if Rollup would make a difference.

## Bundling with Browserify

Out of the box that project comes with Babel 6 and Browserify for building. To try to be as fair as possible I updated the Browserify build process to include [Uglifyify](https://github.com/hughsk/uglifyify), a Browserify transform which minifies code as it's run through Browserify. Uglifyify can make some extra optimisations due to being run on each file, so it's worth including. To generate the Browserify bundle I ran:

```
babel src --presets es2015 --out-dir=dist && browserify -t uglifyify dist/app.js | uglifyjs -c > dist/bundle.js
```

This runs Babel with the ES2015 preset and then runs the processed code through Browserify, using the Uglifyify transform and then minifying again with UglifyJS to be most effective. __If you have any ideas on how to optimise this further, please let me know and I'll update the post__.

Running this on my machine gives me a file that's 15.8KB in size. Not bad, but can we do better?

## Bundling with Rollup

There's a bit of extra work to get Rollup playing nicely. Rollup requires code written with ES2015, but Babel's default ES2015 plugin set will convert the code into CommonJS. Therefore we can't use that preset in order to transpile our code. Thankfully Rollup publishes its ES2015 preset that matches Babel's which the exclusion of the CommonJS plugin. First I installed that and Rollup itself, along with the Rollup Babel plugin and the Rollup Uglify plugin.

```
npm install --save-dev babel-preset-es2015-rollup rollup rollup-plugin-babel rollup-plugin-uglify
```

I also can't do everything I need to do with Rollup in a command line call, so I created `rollup-build.js` to contain my code:


```javascript
import { rollup } from 'rollup';

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

rollup({
  // tell rollup our main entry point
  entry: 'src/app.js',
  plugins: [
    // configure rollup-babel to use the ES2015 Rollup preset
	// and not transpile any node_modules files
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    }),
	// minify with uglify
	uglify()
  ]
}).then((bundle) => {
  // write bundle to a file and use the IIFE format so it executes immediately
  return bundle.write({
    format: 'iife',
    dest: 'dist/rollup-bundle.js'
  });
}).then(() => {
  console.log('Bundle created');
});
```

To run this code I first need to run it through Babel (this is optional, I could have written the above script using only features Node supports), so I'll install `babel-cli`:

```
npm install --save-dev babel-cli
```

And then I can generate the Rollup bundle:

```
babel-node --presets es2015 rollup-build.js
```

That generates `dist/rollup-bundle.js`, which comes in at 11.3KB in size, a saving of approximately 4.5KB.

## Conclusion

Even on this small project with no external dependencies Rollup's build was able to save 4.5KB on an initial bundle of 15.8KB, which is a saving of over 33%. On a larger project with more dependencies and code I'd be willing to bet Rollup would save more.

In a future post I will do more exploring with Rollup and look at how we'd configure it on a much larger project that contains npm dependencies, and modules written in CommonJS (that Rollup, without a plugin) can't parse.




