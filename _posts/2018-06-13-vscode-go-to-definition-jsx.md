---
layout: post
title: Enabling VSCode's "Go to Definition" for JSX imports
intro: A quick post today on how to configure VSCode's "Go to Definition" to work when importing a JSX file.
githubPath: 2018-06-13-vscode-go-to-definition-jsx
---

I have recently been trialling using Microsoft's VSCode editor as my primary code editor, and so far I've been very happy with it. One feature that I've particularly enjoyed is "Go to Definition". This lets you hover over any variable/class/object/etc and be taken to the place where it is defined, even if it's in another file.

This is particularly useful for me in JavaScript imports. If I have this line:

```js
import Foo from './foo'
```

I can right click on `Foo` (or hit the shortcut, `F12` by default), and click "Go to Definition", and be taken to `foo.js`.

One problem I found though is that by default, if the file is `foo.jsx`, not `foo.js` (at work we put React components in `.jsx` to differentiate them easily from plain JS files), this won't work. We have Webpack configured to look for both `.js` and `.jsx` files, but need to tell VSCode to do the same.

The solution here is to define a [`jsconfig.json`](https://code.visualstudio.com/docs/languages/jsconfig), which is a file that you can define to configure how VSCode understands your projects. We can tell VSCode that we're working with JSX by adding `"jsx": "react"` to our `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "react"
  },
  "exclude": ["node_modules", "build"]
}
```

> Note that `exclude` is important: here I've defined `node_modules` and also `build`, which is the directory that Webpack builds to. I'm doing this to stop VSCode wasting time trying to parse files in these directories.

Once you've updated this, you'll find that "Go to Definition" works just fine on imports from `.jsx` files, as well as `.js` files.

