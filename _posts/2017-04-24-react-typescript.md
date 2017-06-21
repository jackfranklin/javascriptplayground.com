---
layout: post
title: Getting started with TypeScript and React
intro: I've recently been learning TypeScript and today I'll take you through how I set up a TypeScript project using React, Babel and Webpack.
githubPath: 2017-04-24-react-typescript
---

I've recently been getting into TypeScript following a lot of positive blogs about it from [Tom Dale](https://medium.com/@tomdale/glimmer-js-whats-the-deal-with-typescript-f666d1a3aad0) and others. Today I'll show you how I've set up a TypeScript project from scratch that uses React, and Webpack for managing the build process. I'll also discuss my initial impressions of TypeScript and in particular working with TypeScript and ReactJS.

I won't be going into detail on the specifics of TypeScript's syntax, but you can read either the [TypeScript handbook](https://www.typescriptlang.org/docs/tutorial.html) or the free book [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/getting-started.html) which will also give you a great introduction to the language.

__Update:__ If you'd like to read this post in German, you can do so [thanks to the awesome folks at Reactx.de](https://reactx.de/artikel/reactjs-typescript/).

## Installing TypeScript and configuring it

The first thing to do was install TypeScript locally into my `node_modules` directory, which I did using Yarn, first using `yarn init` to create a new project:

```
yarn init
yarn add typescript
```

When you install TypeScript you get the `tsc` command line tool which can compile TypeScript but also create a starting `tsconfig.json` for you to edit. You can get this by running `tsc --init` - if you've installed TypeScript locally you'll need to run `./node_modules/.bin/tsc --init`.

__Note:__ I have the `./node_modules/.bin` directory on my `$PATH`, [which you can find in my dotfiles](https://github.com/jackfranklin/dotfiles/blob/master/zsh/zshrc#L101). This is _slightly_ risky, as I could accidentally run any executable that's in that directory, but I'm willing to take that risk because I know what's installed locally and it saves a lot of typing!

`tsc --init` generates a `tsconfig.json` which is where all the config for TypeScript's compiler lives. There's a few changes I've made to the default config, and the one I'm using is below:

```js
{
  "compilerOptions": {
    "module": "es6", // use ES2015 modules
    "target": "es6", // compile to ES2015 (Babel will do the rest)
    "allowSyntheticDefaultImports": true, // see below
    "baseUrl": "src", // enables you to import relative to this folder
    "sourceMap": true, // make TypeScript generate sourcemaps
    "outDir": "ts-build", // output directory to build to (irrelevant because we use Webpack most of the time)
    "jsx": "preserve", // enable JSX mode, but "preserve" tells TypeScript to not transform it (we'll use Babel)
    "strict": true,
  },
  "exclude": [
    "node_modules" // don't run on any code in the node_modules directory
  ]
}
```

### `allowSyntheticDefaultImports`

This rule allows you to use ES2015 style default imports even when the code you're importing doesn't have an ES2015 default export.

This happens when you import, for example, React, whose code is not written in ES2015 (the source code is, but React ships a built version). This means that it technically doesn't have an ES2015 default export, so TypeScript will tell you so when you import it. However, build tools like Webpack are able to import the right thing, so I turn this option on because I prefer `import React from 'react'` over `import * as React from 'react'`.

### `strict`: true

[TypeScript version 2.3](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#new---strict-master-option) introduced a new config option, `strict`. When turned on this configures TypeScript's compiler to be as strict as possible - this might not be what you want if you're porting some JS to TS, but for new projects it makes sense to be as strict as possible out of the box. This turns on a few different settings, the most notable of which are `noImplicitAny` and `strictNullChecks`:

#### `noImplicitAny`

Often when you want to add TypeScript to an existing project TypeScript makes it easy by not throwing an error when you don't declare the types of variables. However, when I'm creating a new TypeScript project from scratch I'd like the compiler to be as strict as possible.

One of the things TypeScript does by default is implicitly add the `any` type to variables. `any` is effectively an escape hatch in TypeScript to say "don't type-check this, it can be any value". That's useful when you're porting JavaScript, but it's better to be strict when you can. With this setting set to `true`, you can't miss any declarations. For example, this code will error when `noImplicitAny` is set to `true`:

```
function log(thing) {
  console.log('thing', thing)
}
```

You can read more about this in the [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html).

#### `strictNullChecks`

This is another option that makes TypeScript's compiler stricter. The TypeScript Deep Dive book has a [great section on this option](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html). With this option on, TypeScript will spot more occasions where you're referencing a value that might be undefined, it will error at you. For example:

```js
person.age.increment()
```

With `strictNullChecks`, if TypeScript thinks that `person` or `person.age` might be `undefined`, it will error and make sure you deal with it. This prevents runtime errors so it seems like a pretty good option to enable from the get go.

## Setting up Webpack, Babel and TypeScript

I'm a big Webpack fan; I enjoy the ecosystem of plugins available, I like the developer workflow and it's good at managing complex applications and their build pipeline. Therefore, even though we could just use TypeScript's compiler, I'd still like to add Webpack in. We'll also need Babel because the TypeScript compiler is going to output ES2015 + React for us, so we'll get Babel to do the work. Let's install Webpack, Babel and the relevant presets, along with [ts-loader](https://github.com/TypeStrong/ts-loader), the Webpack plugin for TypeScript.

There is also [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader), but I found `ts-loader` first and so far it's been great. I would love to hear from anyone who uses the `awesome-typescript-loader`, and how it compares.

```
yarn add webpack babel-core babel-loader babel-preset-es2015 babel-preset-react ts-loader webpack-dev-server
```

At this point I have to thank Tom Duncalf, whose [blog post on TypeScript 1.9 + React](http://blog.tomduncalf.com/posts/setting-up-typescript-and-react/) was a brilliant starting point for me and I highly recommend it.

There's nothing too surprising in the Webpack config, but I've left some comments in the code to explain it:

```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // put sourcemaps inline
  devtool: 'eval',

  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: [
    'index.tsx'
  ],

  // configure the output directory and publicPath for the devServer
  output: {
    filename: 'app.js',
    publicPath: 'dist',
    path: path.resolve('dist')
  },

  // configure the dev server to run 
  devServer: {
    port: 3000,
    historyApiFallback: true,
    inline: true,
  },

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },

  module: {
    loaders: [
      // .ts(x) files should first pass through the Typescript loader, and then through babel
      { test: /\.tsx?$/, loaders: ['babel-loader', 'ts-loader'], include: path.resolve('src') }
    ]
  },
}
```

We configure the loaders so that any `.ts(x)` file is first passed through `ts-loader`. This compiles it with TypeScript using the settings in our `tsconfig.json` - and emits `ES2015`. We then use Babel to convert that down to ES5. To do this I create a `.babelrc` that contains the presets that we need:

```js
{
  "presets": ["es2015", "react"]
}
```

And with that, we're now ready to write our TypeScript application.

## Writing a TypeScript React component

Now we are ready to create `src/index.tsx`, which will be our application's entry point. For now we can create a dummy component and render it to check it's all working.

```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  return (
    <div>
      <p>Hello world!</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
```

If you run Webpack now against this code you'll see some errors:

```
ERROR in ./src/index.tsx
(1,19): error TS2307: Cannot find module 'react'.

ERROR in ./src/index.tsx
(2,22): error TS2307: Cannot find module 'react-dom'.
```

This happens because TypeScript is trying to figure out the type of React, and what it exports, and is trying to do the same for React DOM. React isn't authored in TypeScript so it doesn't contain that information, but thankfully for this situation the community has created [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), a large repository of types for modules.

The installation mechanism changed recently; all the types are published under the npm `@types` scope, so to get the types for React and ReactDOM we run:

```
yarn add @types/react
yarn add @types/react-dom
```

And with that the errors go away. Whenever you install a dependency you can always try installing the `@types` package too, or if you want to see if it has types available, you can use the [TypeSearch](https://microsoft.github.io/TypeSearch/) website to do so.

## Running the app locally

To run the app locally we just run the `webpack-dev-server` command. I set up a script, `start`, that will do just that:

```js
"scripts": {
  "start": "webpack-dev-server"
}
```

The dev server will find the `webpack.config.json` file and use it to build our application.

If you run `yarn start` you will see the output from the server, including the `ts-loader` output that confirms it's all working.

```
$ webpack-dev-server
Project is running at http://localhost:3000/
webpack output is served from /dist
404s will fallback to /index.html
ts-loader: Using typescript@2.3.0 and /Users/jackfranklin/git/interactive-react-introduction/tsconfig.json
Version: webpack 2.4.1
Time: 6077ms
 Asset     Size  Chunks                    Chunk Names
app.js  1.14 MB       0  [emitted]  [big]  main
webpack: Compiled successfully.
```

To view it locally I just create an `index.html` file that loads our compiled code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Typescript App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="dist/app.js"></script>
  </body>
</html>
```

You should see `Hello world!` on port 3000, and we have TypeScript working!

## Typing a module

For a project I was working on I wanted to use the [React Ace module](https://github.com/securingsincity/react-ace) to include a code editor in my project. However, the module doesn't provide types for it, and there is no `@types/react-ace` either. In this case, we have to add the types to our application so TypeScript knows how to type it. Whilst this can seem annoying, the benefits of having TypeScript at least know a little about all your third party dependencies will save you debugging time.

To define a file that has just types in, you suffix it `.d.ts` (the 'd' is for 'declaration') and you can read more about them on the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction). TypeScript will automatically find these files in your project, you don't need to explicitly import them.

I created the file `react-ace.d.ts`, and added the following code that creates the module and defines its default export as a React component:

```js
declare module 'react-ace' {
    interface ReactAceProps {
      mode: string
      theme: string
      name: string
      editorProps?: {}
      showPrintMargin?: boolean
      minLines?: number
      maxLines?: number
      wrapEnabled?: boolean
      value: string
      highlightActiveLine?: boolean
      width?: string
      fontSize?: number
    }

    const ReactAce: React.ComponentClass<ReactAceProps>
    export = ReactAce
}
```

I first create a TypeScript interface for the properties that the component takes, and then the line `export = ReactAce` declares that the component is the object exported by the module. By typing the properties, TypeScript will tell me if I typo a property or forget to pass one, which is really valuable.

## Testing

Finally, I also wanted to have a good testing set up with TypeScript. I'm a huge fan of Facebook's [Jest](https://facebook.github.io/jest/), and did some googling to find out if I could run it with TypeScript. Turns out it's very possible, and there's even the [ts-jest](https://www.npmjs.com/package/ts-jest) package available which does all the heavy lifting. In addition, there is a `@types/jest` package so you can have all your tests type-checked too.

Huge thanks to RJ Zaworski, [whose post on TypeScript and Jest](https://rjzaworski.com/2016/12/testing-typescript-with-jest) got me started on this topic. Once you install `ts-jest`, you just have to configure Jest, which is done in the `package.json`, with some settings:

```js
"jest": {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "transform": {
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "/*.spec.(ts|tsx|js)$"
},
```

The first setting tells Jest to look for `.ts` and `.tsx` files. The `transform` object tells Jest to run any TypeScript files through the ts-jest preprocessor, which runs them through the TypeScript compiler and produces JavaScript that Jest can consume. Finally, I updated the `testRegex` setting to look for any `*.spec.ts(x)` files, which is my preferred naming convention for tests.

With this, I can just run `jest` and have everything work as expected.

## Linting with TSLint

Although TypeScript gives you a lot of checks on your code, I still wanted a linter to enforce some code style and quality checks. Much like ESLint to JavaScript, [TSLint](https://palantir.github.io/tslint/) is the best option for checking TypeScript files. It works in the same way as ESLint - with a set of rules that you enable or disable, and there's also a [TSLint-React](https://github.com/palantir/tslint-react) package to add React specific rules.

You can configure TSLint via a `tslint.json` file and mine is below. I use both the `tslint:latest` and `tslint-react` presets, which enables a bunch of rules. I disagree with some of the defaults though so I override them - you might choose to do differently - this is up to you!

```js
{
    "defaultSeverity": "error",
    "extends": ["tslint:latest", "tslint-react"],
    "jsRules": {},
    "rules": {
      // use single quotes, but enforce double quotes in JSX
      "quotemark": [true, "single", "jsx-double"],
      // I prefer no semi colons :)
      "semicolon": [true, "never"],
      // This rule makes each Interface be prefixed with 'I' which I don't like
      "interface-name": [true, "never-prefix"],
      // This rule enforces objects to always have keys in alphabetical order
      "object-literal-sort-keys": false
    },
    "rulesDirectory": []
}
```

I can then run `tslint --project tsconfig.json` to lint my project.

## Conclusion

In summary, I've found TypeScript to be a joy to work with so far. I'll definitely be blogging more about the specifics of the language and how I'm using it, but in terms of setting up a build process, configuring all the tools and getting started with types, it's been a real joy. I'd highly recommend giving it a go if you're looking for a bit more structure in your JS applications and want a strong compiler to help you avoid mistakes and spend less time debugging.

If you'd like to browse the code or get started from what I created in this post, I [pushed an example repo to GitHub](https://github.com/javascript-playground/react-typescript-jest-demo) that you can use as a starting point. Feel free to raise an issue on that repo if you have any questions about it.
