---
layout: post
title: "Configuring ESLint on a TypeScript project"
intro: A quick post today on how to configure ESLint to run on a TypeScript project.
githubPath: 2019-01-28-typescript-eslint
---

Whenever I've used TypeScript in the past, I've set up
[TSLint](https://palantir.github.io/tslint/) as my linting tool of choice.
However, I've always wished I could use [ESLint](https://eslint.org/) instead,
for a few reasons:

1. I am more familiar with ESLint, and I know its rules better and have my
   preferred set of plugins.
2. All the JS projects I work on use ESLint, so having all my projects use the
   same linter is beneficial.
3. I already have an ESLint plugin in my editor, so I don't have to configure
   the TSLint plugin in addition.

I was therefore thrilled to read a
[post on the ESLint blog](https://eslint.org/blog/2019/01/future-typescript-eslint)
about the future of TypeScript and ESLint, with the
[TypeScript 2019 roadmap](https://github.com/Microsoft/TypeScript/issues/29288)
mentioning them transitioning to ESLint and contributing to the project.

I had to set up a new frontend project this week and I decided to use TypeScript
and try ESLint for the first time. I thought it would be useful to document the
process to help others get started!

## Installing dependencies

First up, we're going to need to install some packages. We'll install `eslint`
itself, but also two plugins we need to allow ESLint to lint TypeScript: a
parser (so ESLint can understand TypeScript's syntax) and the plugin (to enable
linting on TS files):

```
yarn add --dev eslint
yarn add --dev @typescript-eslint/eslint-plugin
yarn add --dev @typescript-eslint/parser
```

## Configuring ESLint

That gives us enough to set up ESLint. Let's create a `.eslintrc.js` file and
configure the parser and the plugin:

> I much prefer using `.eslintrc.js` over a JSON file, primarily because it lets
> you leave comments in your configuration!

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
}
```

With that ESLint is all set up to run on TS files, but we haven't enabled any
rules! You can find all the
[rules and documentation on GitHub](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules),
but I decided to enable the recommended set of rules that the plugin provides,
by using the `extends` configuration key:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
}
```

> At the time of writing there isn't a website with these rules documented yet,
> but I'm sure there will be soon, and I'll update this post when that happens.

And with that, we're set! The beauty of this is that you can continue to use any
other ESLint configurations you like (for example, I always
[integrate Prettier into my ESLint setup](https://prettier.io/docs/en/eslint.html))
and now I can do that whilst also linting TypeScript, too!

## Enabling ESLint on TS files in VSCode

One final note for all you VSCode users out there - by default the ESLint plugin
only runs on `javascript` and `javascriptreact` files. To tell it to run on TS
files, you need to update the `eslint.validate` setting to:

```js
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
]
```

And that will get you nice linting errors in your editor.
