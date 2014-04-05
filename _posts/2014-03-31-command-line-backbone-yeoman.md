---
layout: post
title: Embracing Command Line Tooling with Backbone Applications
intro: In this post we'll look at how we can use command line tools like Grunt, Bower and Yeoman to speed up development of complex applications.

---

In this article I'll take you through how we can use command line tools such as [Grunt](http://gruntjs.com/), [Bower](http://bower.io/) and [Yeoman](http://yeoman.io) to speed up our typical development workflow. Today I'll be using the example of a Backbone application, but it's easily applied to any other type of front-end application or web site you might be building.

The use of tools on the command line has really increased over the past two years, particularly when it comes to tools for working on the front-end. We've seen the rise of Node.js, enabling us to run JavaScript on the command line which consequently has seen developers write scripts to automate part of their workflow. You may already use some of these tools to run preprocessors such as [Sass](http://sass-lang.com/), [LESS](http://lesscss.org/), [CoffeeScript](http://coffeescript.org/) or another.

Embracing a tool like Yeoman lets you move away from a lot of the manual lifting that comes with setting up and then working on a project. For example, until I used Yeoman I would often create new projects from scratch; creating the folder structure, creating my initial JavaScript files and downloading any resources I needed manually by finding them online. Not only does this take time, but it's something us developers have to do so frequently, that it's silly not to automate this. Yeoman will set this up for you, along with a lot else. Things like upgrading to the latest version of a library, or minifying your JavaScript before deployment, can be done in an instant with a proper tool chain.


Today we'll be using the modern workflow as defined on the [Yeoman site](http://yeoman.io/). This consists of three parts:

- __Yo__. Yo is the tool built by the Yeoman team to quickly generate a project and scaffolding out a new application.
- __Bower__. Bower is used for managing dependencies, so there's no longer any need to manually download library source files yourself.
- __Grunt__. Grunt is a JavaScript task runner and contains tasks for running your app's tests, building a minified and ready for deployment version of your app, and much more that we'll see shortly.

## Yo

Before we can look at how Bower and Grunt work, we need to have a sample project to use. Thankfully, this is where Yo is perfect. To install Yo, you'll need to have NodeJS, npm (which usually comes as part of Node) and Git installed. You can install NodeJS through the installer on the [NodeJS website](http://nodejs.org/). This also installs npm, the node package manager, for you. Similarly, you can install Git from the [Git website](http://git-scm.com/).

### Installing Yo

Once you've got that far, it's time to install Yo. Yo is a node module which we install via npm. It will provide us with a command line program that we can use to scaffold new applications. The first thing to do is load up your terminal and run:

    $ npm install --global yo

The `--global` flag instructs npm to install the module _globally_. By installing it globally, it will be available to use from everywhere on your machine, so you can run `yo` regardless of the directory you are currently in. When you run that command you'll get a whole load of output, but once it's done Yo will be installed. To test it, run this command:

    $ yo --version
    1.1.2

If you see that, you can be confident that Yeoman is installed properly.

### Generators

Generators are at the heart of Yo - they are what you run run to generate files and folders for projects. Yo doesn't come with any generators by default, but there are a vast number available that are [listed on the Yeoman site](http://yeoman.io/community-generators.html). In this article we're going to use the Backbone generator. The Backbone generator is on [Github](https://github.com/yeoman/generator-backbone) and, just like Yo, is installed through npm. You can install it by running this command on your command line:

    $ npm install --global generator-backbone

However, before we run the Backbone generator, let's see what happens if you simply run `yo` on your command line. You'll see Yo give you a prompt, asking you what to do. It will list the generators you have installed, allow you to update your generators, search for a new generator, or get some help. If you ever forget what generators you have available, or want to update your installed generators, the `yo` command is the easiest way to do this.

### Yo Backbone

Yo will detect that the generator has been installed and we can now use it. So let's scaffold our new application! Create a new directory to host your application, navigate into it and then run this command in your terminal:
    
    $ yo backbone library

Yo will then prompt you to ask if you'd like any other functionality. It will ask if you'd like Twitter Bootstrap for Sass, CoffeeScript or RequireJS. To select these options, navigate up and down with your arrow keys and hit 'space' to select the item. For the purposes of this tutorial, I'm going to keep it simple and not use any extras.

Once you're happy, hit 'enter'. You'll see a whole load of output to your terminal as the generator creates the necessary files and folders. It will then run `npm install` and install Grunt and Bower too, which we will look at in more detail shortly.

### Other Generators

If you like the look of Yeoman but don't do much work with Backbone, don't worry, there's a huge list of generators out there, including ones for building [Chrome Apps](https://github.com/yeoman/generator-chromeapp#readme), [AngularJS](https://github.com/yeoman/generator-angular#readme) and [EmberJS](https://github.com/yeoman/generator-ember#readme), to name just a couple. The [generators list](http://yeoman.io/community-generators.html) previously linked is the best resource for finding a generator to fit your needs.

### The Generated Code

A lot happened there so let's step through it, firstly by looking at the files that were created.

You'll see that the following directories have been created:

- `test/` - this is where all your tests will go
- `app/` - this houses the main code in your application. It contains the Bower dependencies, images, CSS and most importantly a `scripts/` folder, which is where most of your JavaScript should go.
- `node_modules` - when `npm` is used to install the dependencies listed in `package.json`, this is where they will be installed to. You can typically ignore this folder - you should never have to directly interact withit yourself.

Along with those main directories it's also created some important files, the three most important of which are in the root directory:

- `bower.json` - this is where the Bower dependencies are listed. As you can see, by default we have a few dependencies:


        {
          "name": "app",
          "version": "0.0.0",
          "dependencies": {
            "jquery": "~2.1.0",
            "underscore": "~1.6.0",
            "backbone": "~1.1.0",
            "modernizr": "~2.7.1"
          },
          "devDependencies": {}
        }

When `bower install` was run earlier, it downloaded jQuery, Underscore, Backbone and Modernizr for us, matching the version numbers specified above. If you find yourself needing another JS library, you should add it here and let Bower do the hard work of downloading it for you.

- `package.json` - just like the `bower.json` file names the JS dependencies, `package.json` does the same for any Node dependencies. If you take a look, you'll see that there are a lot of Grunt plugins. These are all used with Grunt to create the build process for building and distributing our app.

- `Gruntfile.js` - there is a lot going on here! Grunt is a JavaScript task runner and its tasks and plugins are configured in the Gruntfile. There is a lot going on here but this sets up our task runner for us. In a moment we will look at the tasks available and what they do.

There's also some other files here that you might not have noticed because they start with a `.`, and your editor may be hiding them. These are important:

- `.bowerrc` - this is used to configure Bower. It contains a JSON object of configuration. The only code in the file sets the directory to which Bower will download the dependencies.

- `.editorconfig` - this is a file used to configure your editor. It's part of [EditorConfig](http://editorconfig.org/), which is designed to be an easy way for developers to use the same code settings, such as spaces/tabs and size of tabs, in a project. If you have the [EditorConfig plugin](http://editorconfig.org/#download) for your editor (Vim, Sublime Text, Notepad++, Emacs, and many more), your editor will update its settings to match the ones in this file.

- `.jshintrc` - the Yeoman generator adds in [JSHint](http://www.jshint.com/), a code linter and quality checker, so we can check our code. Grunt has a task for JSHint, so we can run `grunt jshint` to check our code. The settings JSHint will use when checking our code are defined in this file.

## Building an Application

Let's get to work on the application. It's going to be a simple library app, and the bit we'll build today will show a list of books in our library. First, we can see the application running. In your terminal, run `grunt serve` and visit `http://localhost:9000`. Bring up the console too, and you should see something that looks like below:

![](/img/yobb-image3.png)

If you see this, Yeoman has set everything up properly and we're all ready to build our application.

Hint: the `grunt serve` task is set up to automatically refresh when it detects changes, so I suggest leaving it running in another tab, rather than stopping and starting it all the time.

### Generating a Model

Previously we used the `yo backbone` command to generate an entire Backbone application, but we can also use it to generate just specific components. Here, we can generate our book model:

```
yo backbone:model book
```

This will create the file `app/scripts/models/book.js`, which looks like this:

```javascript
/*global app, Backbone*/

app.Models = app.Models || {};

(function () {
    'use strict';

    app.Models.BookModel = Backbone.Model.extend({

    });

})();
```

Notice it attaches onto the `app` global which is created within the `scripts/main.js` file. Our `app` object contains a blank object called `Models` too, so we add `BookModel` into that. Grunt takes care of loading this file in too, so we don't have to worry about that.

### Testing a Model

Yeoman sets up everything you need to get started testing your Backbone entities. Let's write some tests for our new model. Load up `test/index.html`, and add in `<script>` tags to load your application files. While we're here, I'll also add a `script` tag for our spec file, which we'll create in a minute. Your `index.html` file should look like so:

```html
<!doctype html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Mocha Spec Runner</title>
    <link rel="stylesheet" href="lib/mocha/mocha.css">
</head>
<body>
    <div id="mocha"></div>
    <script src="lib/mocha/mocha.js"></script>
    <script>mocha.setup('bdd')</script>
    <!-- assertion framework -->
    <script src="lib/chai.js"></script>
    <script>var expect = chai.expect</script>
    <script src="bower_components/jquery/jquery.js"></script>
    <script src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/backbone/backbone.js"></script>

    <!-- include source files here... -->
    <script src="../scripts/main.js"></script>
    <script src="../scripts/models/book.js"></script>

    <!-- include spec files here... -->
    <script src="spec/book_model.js"></script>

    <script>mocha.run()</script>
</body>
</html>
```

Now let's write our test. Create the file `test/spec/book_model.js` and add write your test. You'll need to leave some comments at the top to tell JSHint which variables it should expect to be global too. For now, we'll write the typical starting test, and make sure 2 + 2 really is 4.

```javascript
/*global describe, it, app */
'use strict';
(function () {
    describe('BookModel', function () {
        it('should pass', function () {
            expect(2+2).to.equal(4)
        });
    });
})();
```

Now you should be able to run `grunt test` on your command line and see that you have 1 spec which is passing! Just for completeness' sake, change `4` to `5` and run it again. You'll see this time you get a failure reported. Grunt's `test` command is used in the default Grunt command which Yeoman set up for us, so it's impossible to ever fully build your app if the tests aren't working. I won't explictly talk about testing and what tests to write, but I encourage you to write tests as you develop.

### Building the app

Let's continue on and define some properties in our model. I'm expecting each book to have a `title` and an `author` property, and as such I'd like to define a summary method, which returns a string summarising the book. It's effectively just the title and the author, joined with the word "by":

```javascript
/*global app, Backbone*/

app.Models = app.Models || {};

(function () {
    'use strict';

    app.Models.BookModel = Backbone.Model.extend({
        summary: function() {
            return this.get('title') + ' by ' + this.get('author');
        }
    });

})();
```

We can write a test too, to make sure the summary method returns what we expect:

```javascript
describe('BookModel', function () {
    it('should have a summary method', function () {
        var book = new app.Models.BookModel({
            title: 'JavaScript: The Good Parts',
            author: 'Douglas Crockford'
        });
        expect(book.summary()).to.equal('JavaScript: The Good Parts by Douglas Crockford');
    });
});
```

Running `grunt test` confirms the good news, we're all green! Now we can write a view so we can start to display this information on screen. Just like with our model, we can use Yeoman to generate it for us:

    yo backbone:view book

This creates two files. The first is `scripts/views/book.js`, which contains the boilerplate around our book:


```javascript
/*global app, Backbone, JST*/
app.Views = app.Views || {};

(function () {
    'use strict';
    app.Views.BookView = Backbone.View.extend({
        template: JST['app/scripts/templates/book.ejs']
    });
})();
```

Notice, however, that it links to another file, a template. If you head to `scripts/templates/book.ejs`, you'll see the following:

    <p>Your content here.</p>

What's happening here is that Yeoman has made us a template, and it also has configured a Grunt task to manage these templates. It will compile the templates and inline them before your app runs. This is why we can refer to it within our view as `JST['app/scripts/templates/book.ejs']`. The Grunt task will create a global `JST` object containing our templates.

Now we'll write a `render` method for our book view, and then get something appearing in the browser.

```javascript
/*global app, Backbone, JST*/

app.Views = app.Views || {};

(function () {
    'use strict';

    app.Views.BookView = Backbone.View.extend({

        template: JST['app/scripts/templates/book.ejs'],
        render: function() {
            var html = this.template(this.model.attributes);
            this.$el.html(html);
            return this;
        }

    });

})();
```

Our `render` method is very straight forward. It compiles the template by passing in the attributes of the model, then sets the HTML content of the view's element, before returning the view itself. Now we have this set up, we can render it on the page! Head to `scripts/main.js` and add in some code to get everything going:

```javascript
/* global app*/
window.app = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function() {
        'use strict';
        var book = new this.Models.BookModel({
            title: 'JavaScript The Good Parts',
            author: 'Douglas Crockford'
        });

        var view = new this.Views.BookView({model: book});
        $('body').append(view.render().el);
    }
};

$(function() {
    'use strict';
    app.init();
});
```

Here we just create a new book and a new view instance. We pass that book into the view instance, and then append it to the body.

Now for the moment of truth. Run `grunt server` again and examine the resulting web page. You should see the text "Your content here" on the left hand side:

![](/img/yobb-image4.png)

That's great! It means that the view was rendered, it correctly used the template and grabbed the content. Let's change the template to the following:

    <p><%= title %></p>

The opening `<%=` and closing `%>` signify to the templating engine that it should replace them with the value of the variable within them. When we compile the template we pass in the model's attributes, one of which is `title`. If you go back to your browser, you'll see that it does indeed output "JavaScript The Good Parts".

Finally, let's use the `summary` method we wrote earlier. To do this, we need to make one quick change to the book model. We need to add an `initialize` method, which is called when we create the model, that will set a `summary` attribute:

```javascript
initialize: function() {
    this.set('summary', this.summary());
},
```

We can then update our template to simply be:

    <p><%= summary %></p>

If you go back to your browser and refresh, you should see the new content.


### Summary

I hope you've seen in this tutorial the power that Yeoman can provide, and the time saved for rapidly getting a new project up and running. It can take some time to get used to the Yeoman mindset, but once you're comfortable harnessing the power of Yeoman, its generators and the Grunt configuration it creates, you can save yourself a huge amount of time.

If you'd like to go further into the world of Yeoman, the below resources should provide you with all you need.

- [The Yeoman.io site](http://yeoman.io/). This should always be your starting point. There's plenty of documentation, help and links to other resources available.
- [GitHub](http://github.com/yeoman). If you happen to stumble upon a bug in Yeoman or a generator, the best place to report that is on the relevant GitHub repository. It's also a good place to see if the issue you've found is already known.
- [@yeoman](https://twitter.com/yeoman). For the latest updates, new generators and other information, the Yeoman Twitter account is definitely worth following. Similarly, there is also the [Yeoman community](https://plus.google.com/101063139999404044459) on Google Plus.

_Thanks to Addy Osmani, Sindre Sorhus and Pascal Hartig for their help reviewing and tweaking this article._
