---
layout: post
title: "Screencast: Creating a React and Webpack Project"
intro: Today I'll show you how to create a Webpack and ReactJS project complete with ES2015, JSX and Hot loading.
---

Last week at the [London JavaScript Community Meetup](http://www.meetup.com/London-JavaScript-Community/events/227578573/) I did a live coding presentation where I created a React project from scratch and configured Webpack to build my application. I also added hot loading to my development workflow and configured ES2015 and JSX support through Babel, along with building a production Webpack file too.

Today I recorded a screencast of me doing this presentation so you can view even if you weren't able to make it to the meetup. In it I do the following:

- Set up Webpack and the Webpack Dev Server.
- Configure Webpack to transpile ES2015 and JSX through Babel.
- Add the react-hot-loader plugin to enable hot reloading of React components.
- Build a small counter application to demonstrate and take advantage of hot loading.
- Create a production Webpack config that can bundle our application into production.

<iframe src="https://player.vimeo.com/video/171783550" width="630" height="394" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/171783550">A React and Webpack Workflow</a> from <a href="https://vimeo.com/javascript">The JavaScript Playground</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

You can find the repository containing all the code [on GitHub](https://github.com/jackfranklin/react-hot-load-webpack-boilerplate). Feel free to fork it or raise an issue if you come across problems.

In future videos I'll cover:

- Testing React using Node, JSDOM and Tape
- Clever bundling using Webpack to create multiple files
- Quicker rebuilds with the Webpack DLL plugin
- And whatever else you'd like to see :)

