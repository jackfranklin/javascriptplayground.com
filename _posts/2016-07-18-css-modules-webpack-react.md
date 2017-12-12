---
layout: post
title: Setting up CSS Modules with React and Webpack
intro: In this post we'll look at how to use CSS Modules in React using Webpack. We'll configure Webpack and the CSS Loader to parse CSS and load it in the browser. By keeping the CSS scoped to each component we can avoid any CSS conflicts and make CSS much easier to deal with.
---

One of the biggest problems that developers face with CSS is that CSS is global. Each CSS class gets exposed globally and it’s very easy to inadvertently break a piece of your site when editing or adding CSS for a new feature. In an era where many developers are building websites as components with a framework such as React, CSS is an even bigger problem.

CSS Modules allow us to write _scoped_ CSS, just like a variable in JavaScript or any other programming language. We can write CSS for a component and be certain that it won’t leak into other components. You can also have confidence that adding a new component to your application won’t interfere with any other components on the system.

CSS Modules are a fantastic idea and play particularly nicely with React, but at the time of writing there isn’t a good resource for getting started and setting up React, CSS Modules and Webpack to build everything correctly. In this article I’ll show you how I took a React application and added CSS modules, which Webpack plugins I used for this, and an example of CSS modules in action. If you’d like to get this running yourself you’ll find all the [code available on GitHub](https://github.com/jackfranklin/react-css-modules-webpack). We’ll also look at how we can generate a production `bundle.css` file which has all our CSS together and fully minified.

## The goal

What we’re aiming for is to be able to write CSS on a per component basis. That is, for each component we have a corresponding `component.css` file that will define the CSS for that component.

For a component `App.js`, we also have `app.css`:

```css
.app p {
  color: blue;
}
```

And then in the component we can import this CSS file, as if it was a JavaScript module:

```js
import styles from './app.css';
```

Finally, we can reference the class name in our CSS file:

```js
<div className={styles.app}>
  <p>This text will be blue</p>
</div>
```

None of this works out of the box, but we’ll use Webpack with a couple of additional loaders to get this working. The beauty is that the actual class name in the generated CSS file won’t be `.app` as above, but `.app-[some-hash]`. By adding a hash to each class name it’s guaranteed that each CSS class declaration is unique (the hash is based on the contents - so if two classes clash it’s because they have the same styles).

## Webpack Loaders

To set this up we’re going to dive into the wonderful world of Webpack loaders. These can be confusing at first, but in essence a Webpack loader is a plugin for Webpack that can apply extra transformations or manipulate files before they are bundled.

There’s two we need to use:

* [`style-loader`](https://github.com/webpack/style-loader) is a Webpack loader that can load some CSS and inject it into the document via a `<link>` tag.
* [`css-loader`](https://github.com/webpack/css-loader) is the loader that can parse a CSS file and apply various transforms to it. Crucially it has a CSS Modules mode that can take our CSS and hash the classes as mentioned above.

In the project that I’m adding CSS Modules to we already have one loader defined for our JavaScript:

```js
module: {
  loaders: [{
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    include: path.join(__dirname, 'src')
  }
}
```

This configures every JavaScript file to be run through the `react-hot` loader, which configures hot module loading, and `babel`, which will transpire ES2015 features and the JSX syntax.

What we need to do is add another configuration for `.css` files where we first configure `style-loader`, and then `css-loader`:

```js
{
  test: /\.css$/,
  loader: 'style-loader'
}, {
  test: /\.css$/,
  loader: 'css-loader',
  query: {
    modules: true,
    localIdentName: '[name]__[local]___[hash:base64:5]'
  }
}
```

First we configure the `style-loader`, which needs no extra configuration, so we’re set. Then we have to configure `css-loader`. The important bit to this is the `query` object, which defines two properties:

* `modules: true` turns on the CSS modules mode
* `localIdentName: '[name]__[local]___[hash:base64:5]'` defines the structure of the generated CSS class should be. You don’t need to worry too much about this, other than knowing that this maps to the generated output. For example, our CSS from above with the class of `app` will end up as `app__app___2x3cr` in the browser.

## Running Webpack

With the above changes to our Webpack configuration we’re done! You can now run Webpack (if you’re running the [example repository](https://github.com/jackfranklin/react-css-modules-webpack), run `npm start` to fire up the Webpack dev server) and have your CSS modules converted and working for you in the browser.

If you’re using the dev server you’ll also note that the CSS is automatically updated when you change without a hard refresh in the browser which is useful during development.

## Tidying up the Webpack configuration

One thing that irks me about the Webpack configuration in its current state is the fact that we have to configure loaders for `.css` twice - once for the style loader, and once for the css loader. I’d much rather group these both up into one. However, once you configure multiple loaders you can’t pass in the `query` object as we did above, and must use Webpack’s string configuration. In our case if we did that, our configuration would look like so:

```js
{
    test: /\.css$/,
    loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
}
```

I think this is pretty messy and much harder to follow.

Thankfully I found [webpack-combine-loaders](https://github.com/jsdf/webpack-combine-loaders) which enables us to use the `query` object syntax to configure a loader, but without having to repeat the `test: /\.css$/` line. Using this module our configuration becomes:

```js
{
  test: /\.css$/,
  loader: combineLoaders([
    {
      loader: 'style-loader'
    }, {
      loader: 'css-loader',
      query: {
        modules: true,
        localIdentName: '[name]__[local]___[hash:base64:5]'
      }
    }
  ])
}]
```

I think this is cleaner because it’s clearer that we’re using both `style-loader` and `css-loader` on the same file type.

## Deploying to Production

The final step is to update the production Webpack build to parse all our CSS and generate an outputted CSS file that contains all our CSS. We don’t want to have our CSS injected through Webpack in production, and we don’t want the CSS module transformations to run in the browser; instead we want to simply deploy a generated stylesheet that contains all our styles.

To do this we can use the [`extract-text-plugin`](https://github.com/webpack/extract-text-webpack-plugin) for Webpack that will take all files that match a regular expression (in our case we’ll look for CSS files as we did previously) and bundle them all into one file. We can also run them through the CSS Modules transform just like we did in our development config.

To get started we first need to install the plugin:

```
npm install extract-text-webpack-plugin —save-dev
```

Then we need to configure the plugin. First we’ll add an entry to the `plugins` key in the Webpack configuration:

```js
// at top of file
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// in the webpack config
plugins: [
  new ExtractTextPlugin('styles.css'),
  ...
]
```

This configures the plugin to output to `styles.css`.

Then we will configure the module loader again to find all our CSS files and bundle them together. The configuration here looks similar, we call `ExtractTextPlugin.extract`. This takes multiple arguments, where each argument is an individual loader to pass. We first pass `style-loader`, and then use `combineLoaders` again to generate a string version of the configuration for `css-loader`:

```js
module: {
  ...,
  loaders: [{
    // JS loader config
  }, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      combineLoaders([{
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }])
    )
  }],
  ...
}
```

Now when we run Webpack with this configuration we’ll have a JavaScript and a CSS file that we can use in production with CSS Modules fully transformed.

## Conclusion

There’s a few final pieces we could do to tidy up, but I’m going to leave those as exercises for the reader. The main issue now is that we’re duplicating configuration for the CSS Loader across our development Webpack setup and our production Webpack setup. You might consider extracting a file that contains that configuration, rather than duplicating it.

CSS Modules are a great way to organise your CSS in a component based system. Here I’ve used them with React but you’ll notice that none of the code in this tutorial is React specific - this approach can be used with other frameworks with no extra effort.

If you’d like to use this tutorial as a starting point, don’t forget that you can [find the repository on GitHub](https://github.com/jackfranklin/react-css-modules-webpack), and please get in touch if you have any questions. You can find more information on the [CSS Modules repository](https://github.com/css-modules/css-modules) and Glenn Maddern’s [“CSS Modules: Welcome to the Future”](http://glenmaddern.com/articles/css-modules) blog post.
