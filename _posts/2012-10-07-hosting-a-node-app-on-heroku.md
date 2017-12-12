---
layout: post
title: "Hosting a Node app on Heroku"
---

_Note: I apologise for the lack of updates on JS Playground recently, but happy to announce the site is now returning to at least one post per week. Any requests for content, please get in touch._

Today I want to look at using the popular [Heroku](http://www.heroku.com) to host a simple Node app. I got asked recently if I had any suggestions on hosting a small Node app, and Heroku's free plan is usually more than enough for little side projects, or to show off something you're working on. It can be a bit daunting if you've never used it before, so I thought a step by step guide would be of use. This tutorial does require knowledge of Git and also you should be comfortable with the command line - if you're not then Heroku probably isn't for you.

Heroku is heavily used to run Ruby / Rails apps but recently added Node.js support and it's a really great way to quickly and easily get something running online.

If you haven't already, you'll need to [sign up to Heroku](https://api.heroku.com/signup/devcenter), which is completely free. You'll then need to install the [Heroku Toolbelt](https://toolbelt.heroku.com/), which will give you access to the `heroku` command line interface.

For the app, I'm going to use the small Express server example I introduced in my [Beginning Node](http://javascriptplayground.com/blog/2012/04/beginning-node-js-express-tutorial) tutorial. This contains `helloworld.js`, which has the following:

    var app = require('express').createServer();
    app.get('/', function(req, res) {
      res.send("Hello World");
    });

    app.listen(3000, function() {
      console.log("listening on 3000");
    });

We need to make one change to this though. Heroku will need us to run on a specific port, which we access through the `process` object, which is available to use. Make your app listen on the port number specified in `process.env.PORT`, or if it can't find one, revert to 3000. This way it will work both locally and on Heroku.

    app.listen(process.env.PORT || 3000, function() {
      console.log("listening on 3000");
    });

And also `package.json`, which lists the dependencies we have. Heroku also recommend you list your engines in `package.json`, so add them in so your file looks like so:

    {
      "name": "jsphelloworld",
      "version": "0.0.1",
      "dependencies": {
        "express": "~2.5.9"
      },
      "engines": {
        "node": "0.8.x",
        "npm": "1.1.x"
      }
    }

_This is using an outdated version of Express but for this tutorial it's irrelevant - there's tutorials planned around Express V3 in the near future._

It's important to note that you have to be using NPM to manage your dependencies to host with Heroku. You also need to be using Git as your VCS too, as to update files on Heroku you do a `git push`. Run `npm install` to make sure your `package.json` file is valid, and that you've got all your dependencies sorted.

Next we need to tell the Heroku server how it should run our app. This is done through what Heroku call a [Procfile](https://devcenter.heroku.com/articles/procfile). It's a simple text file created in the project root and for this example, we simply need to tell it how to run our app, which is done like so:

    web: node helloworld.js

That's **all** your Procfile should contain. Youc an test this by running it through Foreman, a way of running apps that uses a Procile to do it. Run `foreman start` (it's installed as part of the Heroku toolbelt) and you should see output somewhat like this:
-> foreman start
12:37:50 web.1 | started with pid 1890
12:37:51 web.1 | Listening on 3000
If you get that, everything's working fine. You can go to `localhost:3000` to check if you want to make sure.

Now it's time to get these files into Git. Initialise your Git repository if your code is not in Git already, and commit all the changes we've made. Now we're ready to run it on Heroku.

On the command line, run `heroku login`. This will authenticate you and set up any neccessary public keys required to allow you to push to Heroku. Now run `heroku create` to get Heroku to set up a site for you:
-> heroku create
Creating fathomless-cove-9338... done, stack is cedar
http://fathomless-cove-9338.herokuapp.com/ | git@heroku.com:fathomless-cove-9338.git
Git remote heroku added
Now it's time to deploy your app. Heroku sets up a git remote for you, so to deploy simply run:

    git push heroku master

This will take a few moments, especially the first time. Your output should look something like:

    -> git push heroku master
    Counting objects: 6, done.
    Delta compression using up to 2 threads.
    Compressing objects: 100% (4/4), done.
    Writing objects: 100% (6/6), 629 bytes, done.
    Total 6 (delta 0), reused 0 (delta 0)

    -----> Heroku receiving push
    -----> Node.js app detected
    -----> Resolving engine versions
           Using Node.js version: 0.8.11
           Using npm version: 1.1.49
    -----> Fetching Node.js binaries
    -----> Vendoring node into slug
    -----> Installing dependencies with npm
          	[snip - NPM logging here is pretty verbose]
           Dependencies installed
    -----> Building runtime environment
    -----> Discovering process types
           Procfile declares types -> web
    -----> Compiled slug size: 4.0MB
    -----> Launching... done, v3
           http://fathomless-cove-9338.herokuapp.com deployed to Heroku

Nearly there! You now need to tell Heroku to run 1 web process, which is done like so:

    heroku ps:scale web=1

And finally, check out your app:

    heroku open

This will open your site in the browser and if yours is like [mine](http://fathomless-cove-9338.herokuapp.com/), you should get the text "Hello World" right back at you.

Heroku can be a little daunting at first but hopefully this guide has shown that it's pretty straight forward once you get used to the way it works.
