---
layout: post
title: Creating Your First Grunt Plugin
intro: Learn how to create your first Grunt plugin
author: James Cryer
author_twitter: jrcryer
---

Today we're taking a look at writing your first Grunt plugin.  For those unfamiliar with Grunt, Grunt is a JavaScript task runner and you can read Jack's previous [tutorials](/archives.html) to find out more information.

Grunt has a plugin architecture, each plugin having its own responsibility. Combining these plugins, each with their own configuration, offers a powerful tool for building modern web applications.  The ecosystem around Grunt is already huge with over 2000+ plugins available for tasks such as compiling [SASS](http://sass-lang.com/), running [JSHint](http://www.jshint.com/) and running [Mocha](http://visionmedia.github.io/mocha/).  A Grunt plugin is a Node package that can be published via NPM.

There may come a point where there isn't a Grunt plugin available for the problem you're trying to automate. Having the knowledge to create your own plugin can come in handy for these situations.

### Before you get started...

Before delving into creating a plugin, it is important to ask yourself the following questions:

* Are there existing plugins that already solve this problem?
* Can my problem be solved by combining a number of existing plugins?
* Are there any existing Node packages that can ease the implementation?

To discover existing plugins, Grunt provides an excellent [search](http://gruntjs.com/plugins).  It has been recently redesigned making it much faster to find a plugin.

Alternatively, use the NPM commandline search to discover existing plugins.  The following will return Grunt plugins that reference SASS:

    > npm search gruntplugin sass

To ease implementing your Grunt plugin, it is always a good idea to explore wrapping existing Node packages.  Often your problem will have already been solved but not automated with Grunt.  Finding an existing Node package that your Grunt plugin can re-use can be a big time saver.

### Scaffolding

[The Grunt team](https://github.com/gruntjs?tab=members) has created a handy [Yeoman](http://yeoman.io) generator to bootstrap your plugin project.  If you don't already have Yeoman installed, complete the following:

    > npm install -g yo

Next we need to install the generator:

    > npm install -g generator-gruntplugin

Create a new directory for your plugin and run the generator:

    > mkdir -p ~/projects/grunt-my-plugin
    > cd ~/projects/grunt-my-plugin
    > yo gruntplugin

The generator will ask you a couple of questions.  Once you've answered the questions, Yeoman will scaffold your plugin.

### Project structure

The Yeoman generator will have scaffolded a project structure as follows:

    - Gruntfile.js
    - README.md
    - node_modules
    - package.json
    - tasks
    - test
     \- expected
     \- fixtures

The `Gruntfile.js` is your Gruntfile for building and testing your Grunt plugin.  The `tasks` folder contains the implementation of your plugin, this will contain a .js file matching your plugin name.  The `test` folder contains the tests for your plugin.

### Implementing the plugin

Lets start by implementing our plugin, this is a very trivial example that lists the contents of a directory specified in the configuration.

Open the .js file in the `tasks` folder, the plugin has been scaffolded to read each source file, concatenate the files content and write it to the destination file.  Insert the following after line 32:

    if (!grunt.file.isDir(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" is not directory.');
        return false;
    }

This will now filter the source files to our plugin to only accept directories.  The above is using the [grunt.file API](http://gruntjs.com/api/grunt.file), a handy set of methods for interacting / recursing the file system.

Next we need to modify the plugin to take each input directory and list it's contents.  Again the grunt.file API comes in handy, modify lines 41:42 as follows:

    return grunt.file.expand({cwd: filepath}, '*')
                .join(grunt.util.linefeed);

    }).join(grunt.util.linefeed);

The above takes a file path and uses [grunt.file.expand](http://gruntjs.com/api/grunt.file#grunt.file.expand) to turn it into an array of files within the input file path.  This array of files are then joined together with a newline character.  The next line joins each group of files together with a newline character, this covers the case when somebody passes multiple input directories to the plugin.

Next we need to remove some of the scaffolded code to make our plugin work as expected.  To do this, delete lines 45:46.

### Testing the plugin

Before releasing our plugin into the wild for others to use, we need to make sure it is working as expected.  The Yeoman generator has already scaffolded some [nodeunit](https://github.com/caolan/nodeunit) tests.  To run the tests, run the following from the root of your project in the terminal:

    grunt

This should result in two failing tests as the tests are still trying to test the scaffolded plugin.  Lets modify the Gruntfile first before modifying the tests.  Update lines 35:52 to match:

    file_lister: {
      single_file_test: {
        files: {
          'tmp/default_options': ['test/fixtures']
        }
      },
      multi_file_test: {
        files: {
          'tmp/custom_options': ['test/fixtures', 'test/fixtures_2']
        }
      }
    },

The first line will vary based on the name you gave to your plugin.  The preceeding lines define two targets for our plugin.  The first will run our plugin against a single source and destination.  The latter will test our plugin with multiple directory inputs.

Next we must modify our tests to confirm our plugin is working as expected.  Firstly, inside the test folder, create a new folder called `fixtures_2` and inside this folder add a new empty file called `test`.  Open the 'file_lister_test.js', this is the test file that is run when `grunt` is called.  You will note that is loading files from a `/tmp` folder, these are created by our Gruntfile.js configuration.  The second file that is loaded on each test are from `expected` folder.

We must update our expected results to match our expected behaviour.  Modify `default_options` in the `expected` folder to match:

    123
    testing

Also update `custom_options` in the `expected` folder to:

    123
    testing
    test

Re-run the tests and you should see two passing tests.

### Publishing the plugin

Now that we've completed our implementation and tested that it is functioning expected, it's time to publish our plugin for others to use.  The Yeoman generator has already created a `package.json`.  This contains all the information needed to publish our Grunt plugin, including keyword of `gruntplugin`.  For our plugin to appear on the Grunt plugins listing, the keyword `gruntplugin` must appear in the keywords section of your package.json.

Once you're happy with all the details, publishing your plugin is as simple as:

    npm publish

That brings us to the end of this tutorial on how create, test and publish a Grunt plugin.





