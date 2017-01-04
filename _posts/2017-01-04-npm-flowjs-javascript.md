---
layout: post
title: Authoring and publishing JavaScript modules with Flow
intro: Today we'll see how we can author and publish JS packages with Flow, adding types to our JavaScript in order to have more confidence in our code and improve the development experience. We'll also see how we can publish types so developers using our code can benefit from the fact that it's typed.
githubPath: 2017-01-04-npm-flowjs-javascript
---

[Flow](https://flowtype.org/) is a static type checker for JavaScript which adds the ability to annotate our JavaScript code with extra information on what types we're expecting values to be, what types functions can return, and so on. Having done a lot of work in [Elm](elm-lang.org), a language that is typed, I began to recently explore the popular options for adding types to JavaScript. Along with Flow there is also [TypeScript](https://www.typescriptlang.org/), which is very popular and used extensively in the Angular 2 community.

I started with Flow primarily because it's used a lot in the React community (unsurprising given Flow is a Facebook project) and it has built in knowledge of React and its types. Although we won't use Flow with React today, it's easy to do so and I'm sure that I'll cover it in a future blog post. This post _is not_ me stating that I have a strong preference for Flow over TypeScript, or a post claiming Flow is better. I am just sharing my experience with Flow - so far it's been a very positive one.

## Writing Typed JavaScript

To start with I needed an example project to work with; I picked [util-fns](https://github.com/jackfranklin/util-fns). `util-fns` is a small project I started working on that contains a bunch of tiny utility functions (much like Lodash or Underscore, but much smaller and less optimised!). It's primarily a dummy project for the sake of learning Flow and experimenting. I also chose this because it's a module that I have published to npm, and as such could explore how to publish the module in such a way that the types are not lost. This means any developers who run `npm install util-fns` can access the type information.

### Installing Flow

To get started with Flow, I first installed it as a local dependency. You need the `flow-bin` package from npm:

```
npm install --save-dev flow-bin
```

You could install this globally, but I like to have all project dependencies installed locally. This also covers you in the circumstance that you have different projects that want to use different versions of Flow.

You then need to run `./node_modules/.bin/flow init`.

__Note:__ I have the `./node_modules/.bin` directory on my `$PATH`, [which you can find in my dotfiles](https://github.com/jackfranklin/dotfiles/blob/master/zsh/zshrc#L101). This is _slightly_ risky, as I could accidentally run any executable that's in that directory, but I'm willing to take that risk because I know what's installed locally and it saves a lot of typing!

By running `flow init` you'll create a `.flowconfig` file which will look like so:

```
[ignore]

[include]

[libs]

[options]
```

Don't worry about the slightly odd syntax here, or the fact that it's largely empty. That config is more than enough for now - I've yet to really have to edit a Flow config - but if you need to there is [extensive documentation on configuring Flow](https://flowtype.org/docs/advanced-configuration.html) on the Flow site.

By creating this file we're now able to run Flow and have it check our code. You can run `flow` now to see what happens!

```
Launching Flow server for /Users/jackfranklin/git/flow-test
Spawned flow server (pid=30624)
Logs will go to /private/tmp/flow/zSUserszSjackfranklinzSgitzSflow-test.log
No errors!
```

The first thing you'll see is that Flow launches a server. This server runs in the background and allows you to incrementally check Flow code as you work. By running on a server, Flow can cache the state of your files and only recheck them when the contents change. This makes it really quick to run Flow on files as you're working. For times when you do want to just check your entire project you can run `flow check`, but in development you should always just run `flow`. This will connect to the Flow server (or start one if there isn't one running) and be much more efficient about checking only the files that have changed.

When you run Flow and see that you have no errors, that's because we don't actually have any code that Flow will check, yet! Flow is designed to be able to be dropped into an existing JavaScript project and not cause a heap of errors, so it only runs on files that have the following comment at the top of the page:

```js
// @flow
```

This means you can incrementally move files over to Flow, which is a big plus point for me. We're considering adding it to our large JS codebase at work and if we couldn't do it incrementally we wouldn't even be able to consider including it in the project.

### Stripping types with Babel

One final piece of admin: Flow is only a type checker, it won't strip the types out of your code and produce JavaScript for production. To do this I recommend using the Babel plugin [`transform-flow-strip-types`](https://babeljs.io/docs/plugins/transform-flow-strip-types/), which tells Babel to remove the types when you compile the code. We'll look at how we then deploy this code to npm later.


### Writing some Flow!

We're now ready to write some code! Let's start with a `sum` function. It can take an array of numbers and will produce the sum of all of these numbers. Here's the JavaScript implementation I came up with:

```js
const sum = input => {
  return input.reduce((a, b) => a + b)
}

export default sum
```

There's nothing too crazy going on here - by using `reduce` we can iterate through the array and add up the numbers as we go. Now I'll use Flow's type annotations to annotate this function. First let's annotate the arguments that this function takes, by declaring that the input argument should be an `Array` of type `number`. This means that `input` will be an array where all the values are of type `number`, and the syntax for this in Flow is `Array<number>`:

```js
// @flow
const sum = (input: Array<number>) => {
  return input.reduce((a, b) => a + b)
}

export default sum
```

Note that I've also added the `// @flow` comment so that Flow will start type checking my code. I'll now declare that the return type of this function is a `number`:

```js
// @flow
const sum = (input: Array<number>): number => {
  return input.reduce((a, b) => a + b)
}

export default sum
```

If you run `flow` again, you'll see that there are still no errors. This means that Flow has confirmed that our code is conforming to the types we told it about.

Let's say we make a mistake (obvious to spot on this small code - but imagine if this was a real life application with much more going on):

```js
// @flow
const sum = (input: Array<number>): number => {
  return input.reduce((a, b) => a + 'b')
}
```

Now when you run `flow`, you will see an error (you may need to scroll the codebox to see the full error):

```
3:   return input.reduce((a, b) => a + 'b')
                                   ^^^^^^^ string.
                                   This type is incompatible with the expected param type of
2: const sum = (input: Array<number>): number => {
                             ^^^^^^ number
```

Flow has correctly spotted that our `reduce` call is adding the string `'b'` to the number `a` and is telling us that it is invalid. It knows `a` is a `number` because we specified that `input` is of type `Array<number>`, and therfore it can spot the issue.

Flow is really good generally at picking up silly mistakes like this and you'll find once you get into the habit of using it that any silly mistakes you make are automatically picked up by Flow, and you'll realise them before you've gone into your browser, refreshed the page and spotted an error.

What's even nicer about Flow is that once you've annotated a function with types, Flow can spot when you then use that function wrong in other places in your codebase.

Let's say in 6 months time you're using the `sum` function that we wrote earlier and you forget that you have to pass an array of numbers. Instead of `sum([1, 2, 3])` you call `sum(1, 2, 3)`. An easy mistake to make but it will have you digging in the command line for an error, or digging into the source code to see what `sum` expects. With Flow checking our code though, we get a much nicer errror:

```
8: sum(1, 2, 3)
       ^ number. This type is incompatible with the expected param type of
2: const sum = (input: Array<number>): number => {
                       ^^^^^^^^^^^^^ array type
```

This saves a lot of time and energy digging into hard to follow console errors, and enables you to spot mistakes as soon as they happen.

This tutorial has barely even begun to scratch the surface of the type system in Flow and what it can do, but for now we're going to move on and look at how we can publish code to npm that's written in Flow. The [Flow docs](https://flowtype.org/docs/getting-started.html#_) have much more information on all that Flow can do for you, and be sure to keep an eye out for future articles on Flow.

## Publishing Typed JavaScript modules

So my small `util-fns` library is ready to be published to npm for the whole world to download and use. I've got a tonne of types throughout my code, and I've also written all the code using ES2015. For publishing in the browser I'm going to use Babel to strip the types and also compile the code into ES5, so it's usable across more browsers. However, it's silly to spend a lot of time and energy adding types to our code, only to strip them from the published module so that no other developers can benefit from them.

Instead, I'd like developers who are using Flow to be able to see the type information for the functions that my module is providing, so if they use them incorrectly, Flow can tell them so. I also want users who don't use Flow to be able to use my module out of the box too, without the need for any additional compilation steps.

The solution here is to publish two versions of the code within one module. One version will be fully compiled with Babel and have all types stripped. The other will be the original code, with all the types left in it. When researching approaches for publishing types to npm, I discovered that when a file is imported, Flow will look not only for that file but for the same file name with `.flow` added on the end. That is, if my code has:

```js
import foo from './my-module'
```

Flow will first see if `my-module.js.flow` exists, and use that if it does, before using `my-module.js`. Of course, all other tools will use `my-module.js`, and ignore the file with the `.flow` extension.

What we need to do is publish two versions of each file in our project. So, for the file `sum.js`, we should publish:

- `lib/sum.js`, which is compiled with Babel and stripped of types.
- `lib/sum.js.flow`, which is the original file, with types left in it.

### Configuring Babel

Configuring Babel to strip Flow types is a matter of creating a `.babelrc` with the `transform-flow-strip-types` plugin enabled, along with any others you might be using.

```js

  "presets": ["es2015"],
  "plugins": [
    "transform-flow-strip-types",
  ]
}
```

You can then tell Babel to take each file in the `src` directory and output a compiled version in the `lib` directory with:

```
babel src/ -d lib
```

Typically you'll want to add the `lib` directory to your `.gitignore`, as we don't want compiled code in Git.

### Telling npm to use the `lib` directory

We also need to tell npm that it should publish files in the `lib` directory when we publish this package. If you've added the `lib` directory to your `.gitignore`, npm by default will respect that and not push the `lib` directory. However, the `lib` directory is actually where the code that we want users to run lives, so in our case we need it published.

My preferred method of doing this is to add a `files` entry to the `package.json`:

```js
"files": [
  "lib"
]
```

And finally, we need to update our package's `main` property. This is the file that will be loaded when the user imports our module (via `import utils from 'util-fns'`). In the case of this project, the file that I'd like to be loaded is `lib/index.js`, so I'll update my `package.json` will that:

```js
"main": "lib/index.js"
```

### Generating `.flow` files

So now we have a `lib` directory full of compiled JavaScript files, but I also want to keep the original files in there, albeit with a `.flow` extension. Luckily I'm not the first to want this, and I found the [flow-copy-source](https://github.com/AgentME/flow-copy-source) project on Github exactly what's needed. I can install this as a developer dependency:

```
npm install --save-dev flow-copy-source
```

And now to run it I simply run:

```
flow-copy-source src lib
```

Once I run that, it will take each file in `src` and copy it to `lib`, adding a `.flow` extension on the end. Now my `lib` directory looks like so:

```
lib
├── index.js
├── index.js.flow
├── ...and so on
├── sum.js
└── sum.js.flow
```

### Building when publishing

We're almost there now and ready to publish the module to npm, but the final step is to make sure that when publishing we don't forget any of the above steps. I can define a `prepublish` script in my `package.json` that npm will run automatically when I run `npm publish`. By doing this I'll ensure my project is all up to date and fully built when I publish new versions to the repository. Typically I'll split up my npm scripts into smaller ones, so I create a new script for running Babel, and another for running flow-copy-source, and make `prepublish` run the both of them:

```js
"prepublish": "npm run babel-prepublish && npm run flow-prepublish",
"babel-prepublish": "babel src/ -d lib",
"flow-prepublish": "flow-copy-source src lib",
```

Finally, we're ready to publish our module! I can run `npm publish` to push a module to the repository, and when I do npm will run my `prepublish` script and generate the compiled files and the `.flow` files:

```
> npm run babel-prepublish && npm run flow-prepublish

> util-fns@0.1.3 babel-prepublish /Users/jackfranklin/git/util-fns
> babel src/ -d lib

src/index.js -> lib/index.js
src/sum.js -> lib/sum.js

> util-fns@0.1.3 flow-prepublish /Users/jackfranklin/git/util-fns
> flow-copy-source src lib
```

## Using our new module

To check that the types are working properly in our published code, we can install our newly published `util-fns` module in another project that's configured with Flow:

```
npm install --save util-fns
```

Now let's say we've gotten confused about the API again, and we try to use a method that doesn't exist:

```js
// @flow
import utils from 'util-fns'

utils.getSum([1, 2, 3])
```

Flow can detect that `getSum` isn't a function that exists in the module:

```
4: console.log(utils.getSum([1, 2, 3]))
                     ^^^^^^ property `getSum`. Property not found in
4: console.log(utils.getSum([1, 2, 3]))
                 ^^^^^ object literal
```

And now imagine I remember that the function is called `sum`, but I forget that I have to pass an array:

```js
// @flow
import utils from 'util-fns'

console.log(utils.sum(1, 2, 3))
```

Flow will pick up on this too, but _only_ because we included those extra `.flow` files in our package. Notice that it also tells us which file to go and look in to find the source for the `sum` function if we want to dig into the types:


```
4: console.log(utils.sum(1, 2, 3))
                         ^ number. This type is incompatible with the expected param type of
2: const sum = (input: Array<number>): number => {
                         ^^^^^^^^^^^^^ array type.
                         See: node_modules/util-fns/lib/sum.js.flow:2
```

This is _brilliant_ as a developer working with a lot of libraries whose APIs I forget a lot. It means that I'm quickly alerted to mistakes and I have hinting and help in my editor telling me what arguments functions accept and what types they are. You can see that a little extra effort as the author of the `util-fns` package leads to a nicer experience for any developers working with my package in a Flow environment.

## Working with libraries without definitions

Although in this case we published the `util-fns` function with type definitions, not all libraries that you'll work with have these built in. There are many, many libraries out there that are not written with Flow, but with plain JavaScript, and it's a shame to not have any type information on those available.

Luckily, [flow-typed](https://github.com/flowtype/flow-typed) is here to help you out. It's an amazing repository full of type declarations for many, many popular libraries, both for NodeJS and client-side JavaScript, including Express, Lodash, Enzyme, Jest, Moment, Redux and more.

You can install `flow-typed` through npm, and then once you do you simply run `flow-typed install` within your project. This will look through your `package.json` for all your dependencies and, for each one, try to install the corresponding type definitions from its repository. This means you can still enjoy type information for libraries like Lodash, even though they are not written using Flow.

## Conclusion

I hope this blog post gives you a look into the world of writing typed JavaScript with Flow. In terms of the type system itself this blog post barely touches the power of Flow, and it's something I'll be writing more about as I get more comfortable with it and learn more. If you're a library author I'd encourage you to try writing in Flow, it's a great experience whilst developing a library and can help prevent bugs. It's also great to include those type definitions when publishing your library; your users will benefit hugely from having Flow able to nudge them when using your library wrong, and it also means Flow can pick up on API changes and inform users when the types change.
