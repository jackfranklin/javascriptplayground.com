---
layout: post
title: Google OAuth2 in Node
author: Gabor Javorszky
author_twitter: javorszky
---

This guest post deals with hooking up Google's service libraries and OAuth2 authentication framework. We're going to build a node application that successfully authenticates with a google account requesting (and being granted) permission to see and manage the user's calendar. We will then also pull in some calendar data. I'll also try to outline how I figure stuff out along the way. It might not be the best process out there, but hey! It works. The application will output data to the website (running on localhost:3000), but will not be styled with any css.

A few assumptions to begin with though:
* I assume you know what Node.js is, and have it set up already to some degree (if not, grab yourself one from [nodejs.org](http://www.nodejs.org) (if you're on a mac, go down the [homebrew route](http://mxcl.github.com/homebrew/) and [install node via that](http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/). That said, I tried to cater for people who are just starting out with Node, so if I'm over-explaining, that's because of this.
* I assume npm is also installed (usually comes with node, but not always. Try to run `npm` in your terminal of choice. If you get help on how to use `npm`, good, otherwise, try to get it (Google is your friend))
* I assume you know JavaScript (although, you are on javascriptplayground.com, so... yeah)
* I assume you have an account with Google
* I assume you're familiar with using the terminal

### Step 0: The setup

First up, let's get to Google, and create our sample application. Go to [http://code.google.com/apis/console](http://code.google.com/apis/console) and log in, if you haven't yet. If you haven't used it before, this is the screen you should get to:

![Google apis console](http://javorszky.co.uk/skitch.png)

Proceed to create a project, select Calendar (as that's our vehicle), accept EULAs and T&Cs, then click on the `API access` on the left, create a new OAuth2 client id, name it anything. Product logo is totally optional. As homepage url, enter `http://localhost:3000`. Click next, make sure it's a Web application and that the `Your site or host name` is `http://localhost:3000`. Make sure it's not `https`. You can leave the callback as is, but take note! Click `Create client ID`. You will see a table that has `Client ID` and `Client secret` in it. You will need these, so keep this window open. Let's move on!

To begin, choose your directory (I put mine in `~/Sites/node/sampleapp`), and create a `package.json` file with the following content:

    {
      "name": "SampleApp",
      "version": "0.0.1",
      "private": true,
      "main": "server",
      "engines": {
        "node": ">=0.8.0"
      },
      "dependencies": {
        "express": "*",
        "jade": "*",
        "googleapis": "*"
      }
    }

To know what each of them mean, [read this bit about package.json](https://npmjs.org/doc/json.html).

After saving the file, run `npm install` in terminal, hit enter, and wait for that to finish.

### Step 1: Creating the node app

In our directory, we have a new folder called `node_modules`. This is where the above stuff were copied. Create two new directories, one called `views`, and one called `lib`. We're going to use `views` for our `.jade` files to display the pages, and the `lib` folder to keep our code modular.

#### Create a file called `app.js`

This goes to the root folder, right where `package.json` is. In that file, paste this bit:

    var express = require('express'),
        app = express(),
        http = require('http'),
        path = require('path'),
        gapi = require('./lib/gapi');

    app.configure('development', function() {
      app.use(express.errorHandler());
    });
    app.configure(function() {
      app.set('port', process.env.PORT || 3000);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.methodOverride());
      app.use(app.router);
    });

    app.get('/', function(req, res) {
      var locals = {
            title: 'This is my sample app'
          };
      res.render('index.jade', locals);
    });

    var server = app.listen(3000);

    console.log('Express server started on port %s', server.address().port);

#### Create another file called `layout.jade`

Put this is in the `views` folder with the following content:

    doctype 5
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
        script(data-main='javascript/main', src='javascript/require.js', type='text/javascript')
      body
        block content

#### Next file is `index.jade`

Next to `layout.jade`, contents:

    extends layout
    block content
      h1= title

#### And finally: `gapi.js`

This one goes into the `lib` folder:

    var googleapis = require('googleapis'),
        OAuth2Client = googleapis.OAuth2Client,
        client = '<put your Client ID here!>',
        secret = '<put your Client secret here!>',
        redirect = 'http://localhost:3000/oauth2callback',
        calendar_auth_url = '',
        oauth2Client = new OAuth2Client(client, secret, redirect);

    exports.ping = function() {
        console.log('pong');
    };

Now, if everything is right, and you type `node app` in the terminal in the root of your project, you should see this message: `Express server started on port 3000`, and if you navigate to [http://localhost:3000/](http://localhost:3000/), then you should see **This is my sample app**.

#### Explanation

The jade files are are rendering the data; basically they churn out html based on the template and the javascript object we pass it. We're going to add some more markup there later. The `gapi.js` will play host to all the google related functionality, so all the code will be put there. Make sure that the client ID, client secret and callback all match up with what Google is saying in the window you still have open.

### Step 2: authenticating with Google

Let's now take a look at the [examples on the github page for the library](https://github.com/google/google-api-nodejs-client/), particularly the one called `oauth2.js`.

There's a couple of things we're already doing, like requiring `googleapis` and declaring `OAuth2Client`, but there are some differences. `readline` is used though, so let's find out what that is. First go-to for me is always the nodejs.org docs, when encountering something unknown, closely followed by a google search along the lines of `readline node`, which would usually yield good results if node docs come up short. According to the docs, it's not something we might use, so let's skip that.

What seems to happen is `googleapis.load` is fired, then its callback is run, then `getAccessToken` with a new `oauth2Client` instance, and then its callback function, which in turn fires `getUserProfile` with a bunch of parameters, `printUserProfile` being the last one. As with pretty much everything that I've seen in node, if the last argument of a function is a reference to a function or a function itself, that's probably a callback, and since `printUserProfile` is a function (declared on line 60), let's assume that's where execution ends.

Let's tear this into pieces, and adapt it to our needs. We're dealing with [OAuth2](https://developers.google.com/accounts/docs/OAuth2), so feel free to read up on what's happening.

#### The tl;dr version of OAuth2

Your app wants access to data (read-write in calendar, and read on OAuth (to get the userinfo)), so it creates a URL that the user must visit. User must explicitly give permission to the app. The URL is unique to the app in question (client ID and secret) and to what you want to do with the user's data (scopes, see below). User signs in with Google account and clicks **Allow access**. Page then takes user back to the return URL, which a) needs to exist on the server, b) needs to be authorized in the client. That's the `http://localhost:3000/oauth2callback` in the client settings at Google. When taking back the user to the callback url, Google also appends a code as a GET parameter that the app can exchange for a `token`. The token will have the access token, token type, expire time, an id and a refresh token.

The access token will be used to tell Google that it's okay and safe to give us data, because User said so. Access tokens expire though, so in an hour you won't be able to use that. Refresh tokens are used to request a new access token. Normally, if the same user allows access to the same application later, Google will not send a refresh token, as the app should have one by now, so that needs to be stored (probably in a database of sorts, not described here).

The client library takes care of the authentication as long as we have the whole token object (which we'll look at soon), so this isn't as scary as one would think.

Okay, so what do we need to do?

1. Generate a URL where User could go to authenticate
2. Make sure we can handle what Google sends us back (page exists, code is extracted)
3. Exchange code for token
4. Use token to get data, and see under the hood

#### Generating the URL

In the example, there's this bit:

    var url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/plus.me'
    });

This is all fine, but this one would authorize the Google+ api. The url gives it away. How do we find what scopes we need? If you Google `google oauth2 scopes`, you'll eventually land on [how to use the OAuth2 user agent](https://developers.google.com/accounts/docs/OAuth2UserAgent), which has basically everything you need for now. Under **Forming the URL**, there is a table where scope is defined as a _"space delimited set of permissions the application requests"_. There's also an [OAuth2 playground](https://developers.google.com/oauthplayground), that will give you clues. Pretty much a scope url is something like this: `https://www.googleapis.com/auth/<service name>`. You can get the service name from the [APIs Explorer](https://developers.google.com/apis-explorer/#p/). When you view the available methods, the first part is going to be the service name.

With that out of the way, there are two more special scopes, `userinfo.email` and `userinfo.profile`, which you would have to dig for (search on APIs explorer for `userinfo`), as it's not easily reachable. Because we want the user's email address (for, say, profile creation), and its profile (name and related available data for personalizing the profile), and we want to interact with the calendar and we want to do this even if the user isn't on the page, these are the options:

    calendar_auth_url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
    });

At the end of the same file, add this:

    exports.url = calendar_auth_url;

This will expose variables in this file outside of this file. In `app.js`, this will be `gapi.url`. Open up `app.js`, and add `gapi.url` to the `locals` object that is sent to `index.jade`.

    app.get('/', function(req, res) {
      var locals = {
            title: 'This is my sample app',
            url: gapi.url
          };
      res.render('index.jade', locals);
    });

In `index.jade`, do this:

    extends layout

    block content
      h1= title
      a(href= url)= "Get permissions"

Restart the server (CTRL-C to kill it first), load up the site again, and click the link. If everything went well, you now should be on a Google page asking you to sign in with a Google account. Select one if you have multiple accounts signed in and click **Allow access**, and... 404.

Darn. Fear not, for I have anticipated this. Next chapter.

#### Make sure we can handle Google

The reason we got a 404 is because we don't have routing available for the return URL. In `app.js`, add this bit of code before the `var server = ` part:

    app.get('/oauth2callback', function(req, res) {
      var code = req.query.code;
      console.log(code);
      var locals = {
            title: 'My sample app',
            url: gapi.url
          };
      res.render('index.jade', locals);
    });

Restart the server, try again and in your terminal you should see a string of characters. That's the code. Awesome.

#### Exchange code for token

Back to the example on GitHub, we see there's a function that deals with this (`oauth2Client.getToken`). `oauth2Client` is something we already have access to, it's just not exported from `gapi.js`. Add this to that file:

    exports.client = oauth2Client;

Modify `app.js` as such:

    app.get('/oauth2callback', function(req, res) {
      var code = req.query.code;
      console.log(code);
      gapi.client.getToken(code, function(err, tokens){
        console.log(tokens);
      });
      var locals = {
            title: 'What are you doing with yours?',
            url: gapi.url
          };
      res.render('index.jade', locals);
    });

Restart server, run, authenticate again, and you should see the tokens appearing in your terminal.

**Ladies and gentlemen, you're authenticated, you now have access.**

### Step 3: Getting the actual data

Now that we have the tokens, it's time to actually do something with it. For that, we'd need to load the service libraries that Google provides through its API. We can use the `googleapis.load` method. Problem with that is that it can load one library at a time, which isn't that much of a mess now, but what if you want to use, say, eight services? That's a whole lot of repetition, and you also need make sure you have everything loaded before proceeding. ~~The library at present isn't able to do that, [but there are plans](https://github.com/google/google-api-nodejs-client/issues/7) to make this happen, but that's a work in progress as of 29th March, 2013.~~ The library has the multiple API discovery implemented, so much awesomeness and less code shall ensue!

We want to use the `v3` of the `calendar` api, and the `v2` of the `oauth2` api. In the `oauth2.js` file in the `examples` folder, the code necessary to achieve this is this:

    googleapis
      .discover('calendar', 'v3')
      .discover('oauth2', 'v2')
      .execute(function(err, client){
        if(!err)
          callback(client);
      });

At the end of it all, we pass the client to a callback function. We don't have one but we have functionality we want to use in there. In the `gapi.js`, move the `exports` statements into a function:

    var callback = function(clients) {
      console.log(clients);
      exports.cal = clients.calendar;
      exports.oauth = clients.oauth2;
      exports.client = oauth2Client;
      exports.url = calendar_auth_url;
    };

I've separated the calendar and oauth into two different bits for easier code later.

`gapi` is the exported object, that holds everything in the `gapi.js` file that was exported. `clients` is the object that holds all the client libraries. `calendar` is the calendar library in the clients object. `calendar.calendarList.list` is a [method you can use on the calendar library](https://developers.google.com/apis-explorer/#p/calendar/v3/calendar.calendarList.list).

After separation, we're left with `gapi.cal.calendarList.list`. Not that much shorter, but less confusing.

If you restart the server, this code makes sure that you have access to the libraries before anything happens, which is what we want to do. (Note: this is not strictly true. In order to be super-mega-sure, start the server AFTER everything finished loading, but for now, by the time you hit "refresh" on your browsers, `gapi` will have everything you need.)

We also have the tokens, so we need to pass them to the `oauth2Client` in `app.js` so we can send authenticated requests. In `app.js`, edit the part where we're handling the return value, and extend it as such:

    app.get('/oauth2callback', function(req, res) {
      var code = req.query.code;
      gapi.client.getToken(code, function(err, tokens){
        gapi.client.credentials = tokens;
        getData();
      });
      var locals = {
            title: 'May sample app',
            url: gapi.url
          };
      res.render('index.jade', locals);
    });

    var getData = function() {
      gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
          console.log(results);
      });
      gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
        console.log(results);
      });
    };

If all is well and you restart the server and look into your terminal you will see both your Google account's user data AND all the calendars in your calendar. From this point on, it's up to you what to do with it. The documentation is there, and the logic is:

`gapi.cal.` + `whatever.command.` + `withAuthclient(gapi.client).` + `execute(callback)`. Callback will take `(err, results)` as paremeters, so make sure you account for that.

`whatever.command` is listed on the Google APIs explorer page, so after [searching for `userinfo`](https://developers.google.com/apis-explorer/#search/userinfo/), we get `oauth2.userinfo.get`. That's going to be your `whatever.command`. (note that `calendar` is `cal` here because the way I separated `calendar` and `oauth2` in `gapi.js`.)

#### One last bit though, just to put everything in the browser.

In the beginning of `app.js`, after declaring `gapi`, add these lines:

    var my_calendars = [],
        my_profile = {},
        my_email = '';

In the function `getData`, extend it as such:

    var getData = function() {
      gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
          console.log(results);
          my_email = results.email;
          my_profile.name = results.name;
          my_profile.birthday = results.birthday;
      });
      gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
        console.log(results);
        for (var i = results.items.length - 1; i >= 0; i--) {
          my_calendars.push(results.items[i].summary);
        };
      });
    };

Let's create one more file: `cal.jade`. Put it next to the other jades:

    extends layout

    block content
      h1= title
      h2= "user is " + user
      p= "Birthday is on " + bday
      p= "Email is " + email
      each event in events
        p= event

And a route in `app.js`:

    app.get('/cal', function(req, res){
      var locals = {
        title: "These are your calendars",
        user: my_profile.name,
        bday: my_profile.birthday,
        events: my_calendars,
        email: my_email
      };
      res.render('cal.jade', locals);
    });

If you now go to `http://localhost:3000/cal` (after having authenticated), you will see your name, your birthday, and a list of your available calendars.

This concludes this tutorial / guest post. The floor is yours, go and create, and if something's not right, get in touch via twitter or by comment. I'll keep an eye on the comment section, and reply as work permits.
