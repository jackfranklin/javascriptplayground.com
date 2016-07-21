---
layout: post
title: Using the HTML Webpack Plugin for generating HTML files
intro: Today we'll set up the HTML Webpack Plugin to dynamically generate the HTML files for our production builds.
---

Whilst most people use Webpack primarily for their JS scripts, there's always one final part of deploying that is forgotten: the HTML. In production we often have extra scripts we want to insert (such as Google Analytics) and also we want to insert a `script` tag to the minified JavaScript and CSS, which probably will have a different filename each time as we generate files with a hash on the end.

Recently I came across the [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and was amazed at how easy it was to add to an application to have all my HTML generated for me too, both in development with the Webpack Dev Server and in production. Following on from my [last post about CSS Modules with Webpack](/blog/2016/07/css-modules-webpack-react/), today I'll take that codebase and automate the HTML side of deploys using the HTML Webpack plugin.

## Configuring for Production

The first step is to install the plugin, which is done through npm:

```
npm install html-webpack-plugin --save-dev
```

Then, to configure our production deploys, I'll edit my `webpack.config.prod.js` file, first by requiring the plugin:

```js
var HtmlWebpackPlugin = require('html-webpack-plugin');
```

Next I'll add an entry to the `plugins` array where I instantiate the plugin with two properties:

- `template` defines the template that the plugin will use to generate the HTML. I'll create this shortly.
- `inject: body` tells the plugin to inject any JavaScript into the bottom of the page, just before the closing `</body>` tag, rather than into the `<head>`.

```js
plugins: [
  ...
  new HtmlWebpackPlugin({
    template: 'index.template.ejs',
    inject: 'body',
  })
],
```

That's the only configuration we need! The plugin will automatically include any files that you're using Webpack to generate. It supports both JS and CSS files so it's a great fit with our CSS Modules project.

Finally I need to create my template. This uses the [EJS](http://www.embeddedjs.com) templating system, which is useful if you need to pass any values into the plugin that should be outputted into the HTML. In our case we don't though, so our template looks like so:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title>Sample App</title>
  </head>
  <body>
    <div id='root'></div>
  </body>
</html>
```

That's it! The resources generated from the bundle will be placed into the HTML at the right points. I can now run `webpack --config webpack.config.prod.js` and see that three files are generated; my JS, my CSS and now an `index.html` too.

The generated HTML file looks like so:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title>Sample App</title>
    <link href="styles-4585896ecd058603fc99.css" rel="stylesheet">
  </head>
  <body>
    <div id='root'></div>
    <script type="text/javascript" src="javascripts-4585896ecd058603fc99.js"></script>
  </body>
</html>
```

As you can see, the CSS and the JS were placed into the file.

### Configuring with Webpack Dev Server

Rather than have a template that's used for my production HTML and a static file I use in development, I'd rather have the same template used for both, to stop my HTML getting out of sync between environments. You might prefer to keep them seperate, but for most of my projects I want the same HTML structure, and I'm happy to trust the HTML Webpack Plugin to insert the right scripts into the right place.

I can edit `webpack.config.dev.js` to use the plugin:

```js
... other requires here
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...,
  entry: [...],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.template.ejs',
      inject: 'body',
    })
  ],
  module: {...}
};
```

This is identical to before, but there's one change to the configuration that is easier to miss: I've changed `output.publicPath` from `/static` to simply `/`. This means that the dev server will generate the files at the root, which means I can load up `localhost:3000` and see my generated HTML without having to visit `/static/index.html`. It's a little messy to keep all my generated JavaScript and CSS at this root level, but I don't mind because I'm using the dev server and the files aren't ever actually written to disk. If you wanted to keep all the files generated in a folder, you can set `publicPath` to `/static` (or whatever you'd like) and use that URL when working on your application.

Now, when I fire up the dev server, I see the generated HTML and everything works as before. Any time I need to change my HTML I can do so in the template and have my development and production HTML environments kept perfectly in sync!

If you'd like to check out this project in action you can see the [react-css-modules-webpack](https://github.com/jackfranklin/react-css-modules-webpack) repository where I've added all the functionality described above.
