---
layout: post
title: Using ReactJS without Webpack
intro: In this post I'll discuss how you can get started with React without needing Webpack.
---

Webpack is a fantastic tool but there's no doubting that as a newcomer to React it's can be a challenge to get started with. I've met numerous developers who have been stumped in their efforts to learn React because they fell into the rabbit hole of Webpack and its configuration.

To demonstrate how you can focus on learning React without needing ES2015, JSX compilation or Webpack I built a sample repository that you can find [on GitHub](https://github.com/jackfranklin/react-no-webpack-required).

The repository uses Gulp to concatenate and minify your files into one, and doesn't do anything to compile ES2015 or JSX. If you've wanted to focus on React without anything else to get in your way, give it a try.

To get started, clone the repository and run `npm install` to get Gulp setup. You can then run `gulp build` to get your app running and `gulp serve` to run a live-server locally, which will refresh when your code changes. Running `gulp watch` will rebuild your application everytime a file changes.

## What, no JSX?

JSX is great and I like using it on projects; but it's another step that can get in the way of focusing on React concepts when getting started. Because JSX gets converted into `React.createElement` calls, we can just use that directly instead:

```jsx
<Foo name='jack' />
// equivalent:
React.createElement(Foo, { name: 'jack' }, null);

<p>
  <span>Hello</span>
</p>
// equivalent:
React.createElement('p', null, React.createElement('span', null, 'Hello'));
```

However, this gets pretty verbose quickly, so I included in the repository a global function `h` that is a shorthand:

```jsx
<Foo name='jack' />
// equivalent:
h(Foo, { name: 'Jack' });

<p>
  <span>Hello</span>
</p>
// equivalent:
h('p', [
  h('span', 'Hello')
]);
```

A natural improvement to this repo would be to add JSX support, but I'll leave that as an exercise to the reader.

## No Modules

Because this repo avoids ES2015 and any transpilation there is no module system available. Instead we just have a global variable, `app`, that contains all of our application. This isn't great, but storing everything in one global variable isn't particularly bad practice, and it means that no module system is required.

## No dependency management?

All dependencies are stored in `vendor` and commited into Git, to avoid any package management confusions or overhead.

## Should I use this in my big production React app?

No, you shouldn't. Tools like Webpack, ES2015 / JSX transpilation and dependency management are incredibly useful as your app scales, but they are not needed when you're working on a smaller app. If you're building a small React application for learning I recommend starting with my repository and then experimenting with adding ES2015, JSX, Webpack and so on as you get more familiar with the ecosystem.


