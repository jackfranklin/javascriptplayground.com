---
layout: post
title: "Misconceptions of Tooling in JavaScript"
intro: Today I'll discuss what I think is a misunderstanding of how tools should be used in the JS development workflow.
---

I wrote back in 2015 about the [state of front end tooling](http://javascriptplayground.com/blog/2015/10/state-of-frontend-tooling) and since that post it's continued to be a topic I follow with interest. I'm particularly interested in other people's perceptions of where the JS community is up to in terms of tooling and what people expect to be provided when they start working with a library.

A library that seems to see this problem most of any is React. I think [Scott Riley](http://twitter.com/scott_riley) put this best:


<blockquote class="twitter-tweet" data-lang="en-gb"><p lang="en" dir="ltr"><a href="https://twitter.com/Jack_Franklin">@Jack_Franklin</a> People need to talk about this more; React is becoming synonymous with ‘spending a week in Webpack before you write any code’</p>&mdash; Scott ☠ (@scott_riley) <a href="https://twitter.com/scott_riley/status/697833161292701697">February 11, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

What I struggle to understand most is _why_ there is an expectation that React should provide (or be easy) to get working very straightforwardly. I suspect this is partly because React has always been written using JSX and hence some form of transformation has always been required, even if you avoid using React's ES2015 `class` syntax in favour of `React.createClass`.

Additionally developers fairly new to React often have this misconception that they must set up a project using Webpack with hot reloading, file watching, ES2015 and so on. Don't get me wrong, Webpack is a fantastic tool and I love working in a project with hot reloading and all the extra developer features, but there's absolutely nothing wrong with working on a project that makes you have to refresh the page manually! Particularly when starting out with a new ecosystem, setting all that extra stuff up at first is only going to lead to frustration. Focus on writing the JavaScript, and add in the developer functionality you need as you feel more comfortable in the environment.

## Getting started with React

To try to demonstrate how this tooling fascination is mostly avoidable when starting out, I want to show how I would set up a React project if someone new to the library wanted to get up and running and have a play around.

In the past I would have done this by dropping Babel into an HTML file as a `script` tag - something that would mean we could get started with no `npm` required - but Babel 6 removed that functionality which means we do have to dive into Node land.

Firstly I'd set up an `index.html` file that loads React, React DOM and then a JavaScript file that Babel will generate for us.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My React App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://fb.me/react-0.14.7.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
```

I'd then create a folder `src`, and create `src/app.js`. Note that there's no ES2015 modules or any of that, we're just creating all our components globally _for now_. I'm focusing on getting up and running with a React project quickly and with as little friction as possible. Once the person gets more comfortable we could layer in additional functionality - starting probably with CommonJS modules.

`src/app.js` is a straight forward component and then the `ReactDOM` call:

```js
var App = React.createClass({
  render: function() {
    return <p>Hello World</p>;
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

Now we need to install the Babel CLI tool and run it on the files in the `src` directory to produce `bundle.js`. First I'd install `babel-cli` and `babel-preset-react` locally. I always install CLI tools locally such that different projects are able to use different versions of tools if they need.

Before doing the install I'd first run `npm init -y` to create a `package.json` for us.

```
npm install --save-dev babel-cli babel-preset-react
```

Finally, we can compile our files by calling `./node_modules/.bin/babel`:

```
./node_modules/.bin/babel --presets babel-preset-react src --out-file bundle.js
```

And then we _don't even need a file server_ to run our app - simply opening `index.html` in the browser does the trick.

![](http://i.imgur.com/Galeap0.jpg)

At this point we could stop now and tell the developer that every time they change their code they need to rerun the above command, but we can do so much better than that.

Firstly, let's move this call into a `package.json` script, which has two benefits:

- we can run it more easily with `npm run <name>`
- `npm` will look in `./node_modules/.bin` for us, so we can shorten the command a little

```json
"scripts": {
  "babel": "babel --presets babel-preset-react src --out-file bundle.js"
},
```

Now `npm run babel` will get our app built. Babel's CLI also provides a `--watch` flag, which will watch the files for changes and recompile them for us, so we can tack that onto the end of our command to get file watching sorted too:

```json
"babel": "babel --presets babel-preset-react src --out-file bundle.js --watch"
```

And finally if we wanted to avoid doing the manual page refreshes we could look to [live-server](https://github.com/tapio/live-server), a great `npm` package that provides us with live reloading out the box. It's important to note that this is entirely optional though, and I probably wouldn't do this immediately for someone brand new - having to manually refresh is no huge deal.

```
npm install --save-dev live-server
```

And now I can add this as another `package.json` script:

```json
"live-server": "live-server --port=3004"
```

And with that I can run `npm run live-server` to get my app running locally and being reloaded for me when files change.

## Conclusion

Is the above what I'd recommend for someone new to a library wanting to get started? Yes. Is it what I'd recommend for a very experienced JS developer working on a large app? No. The key takeaway from this blog post is that you can __layer tools and functionality__ as you get more comfortable with the tools and the ecosystem you're working with. Whilst I've used React as the example in this post this applies more generally across the board with any fairly modern JS library (with the exception of Ember and Ember CLI).

You should start with nothing, and work your way up, rather than jumping in right at the deep end with some complex boilerplate project. Boilerplates are great if you're familiar with the environment, but a nightmare for a beginner. Taking time to understand exactly what the tools are doing and why we need them will give a greater understanding and appreciation. By introducing beginners with less complex tools we keep the barrier to entry low and hopefully their enjoyment of the language and libraries high.

Finally, yes our tooling can get better and we can definitely make improvements to keep developers happier and more productive. If you're jumping into a complex React + ES2015 + JSX + whatever else environment, you have to be prepared to deal with the occasional rough edge and tool problem.

