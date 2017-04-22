---
layout: post
title: Getting started with TypeScript and React
intro: I've recently been learning TypeScript and today I'll take you through how I set up a TypeScript project using React, Babel and Webpack.
githubPath: 2017-04-25-react-typescript
---

I've recently been getting into TypeScript following a lot of positive blogs about it from [Tom Dale](https://medium.com/@tomdale/glimmer-js-whats-the-deal-with-typescript-f666d1a3aad0) and others. Today I'll show you how I've set up a TypeScript project from scratch that uses React, and Webpack for managing the build process. I'll also discuss my initial impressions of TypeScript and in particular working with TypeScript and ReactJS.

I won't be going into detail on the specifics of TypeScript's syntax, but you can read either the [TypeScript handbook](https://www.typescriptlang.org/docs/tutorial.html) or the free book [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/getting-started.html) which will also give you a great introduction to the language.

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
    "noImplicitAny": true, // don't allow implicit `any` types (covered more below)
    "strictNullChecks": true // make TypeScript stricter about potential null/undefined values
  },
  "exclude": [
    "node_modules" // don't run on any code in the node_modules directory
  ]
}
```

### `allowSyntheticDefaultImports`

This rule allows you to use ES2015 style default imports even when the code you're importing doesn't have an ES2015 default export.

This happens when you import, for example, React, whose code is not written in ES2015 (the source code is, but React ships a built version). This means that it technically doesn't have an ES2015 default export, so TypeScript will tell you so when you import it. However, build tools like Webpack are able to import the right thing, so I turn this option on because I prefer `import React from 'react'` over `import * as React from 'react'`.

### `noImplicitAny`

Often when you want to add TypeScript to an existing project TypeScript makes it easy by not erroring when you don't declare the types of variables. However, when I'm creating a new TypeScript project from scratch I'd like the compiler to be as strict as possible.

One of the things TypeScript does by default is implicity add the `any` type to variables. `any` is effectively an escape hatch in TypeScript to say "don't typecheck this, it can be any value". That's useful when you're porting JavaScript, but it's better to be strict when you can. With this setting set to `true`, you can't miss any declarations. For example, this code will error when `noImplicitAny` is set to `true`:

```
function log(thing) {
  console.log('thing', thing)
}
```

You can read more about this in the [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html).

### `strictNullChecks`

This is another option that makes TypeScript's compiler stricter. The TypeScript Deep Dive book has a [great section on this option](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html). With this option on, TypeScript will spot more occassions where you're referencing a value that might be undefined, it will error at you. For example:

```js
person.age.increment()
```

With `strictNullChecks`, if TypeScript thinks that `person` or `person.age` might be `undefined`, it will error and make sure you deal with it. This prevents runtime errors so it seems like a pretty good option to enable from the get go.
