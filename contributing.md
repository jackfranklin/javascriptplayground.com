---
layout: page
title: Contributing
---

The JavaScript Playground used to run under a CMS, but now runs on Jekyll, the static site generator. The site is hosted [in a Github repository](https://github.com/jackfranklin/javascriptplayground.com) which means anyone can submit changes or even new articles through the means of a pull request.

To do this, you should create your own fork of the repository, make your changes, and then create a pull request.

### Check the content!
If you're planning to write an article, I suggest you contact me first (@Jack_Franklin, jack at jackfranklin dot net). I'm always open to contributions but I am always working on new posts of my own, so it's a good idea to check so you don't write something I'm about to publish and hence your effort be wasted.

### Forking on Github
You should fork the [github repository](https://github.com/jackfranklin/javascriptplayground.com) and then add your post. Posts are added in the `_posts` folder and follow the naming convention:

    2013-06-05-title-slug.md

Don't worry too much about getting the date right. I'll ask you to change it to the date of publication once it's ready to go live.

Before making your pull request you should run the JS Playground site locally to make sure everything looks fine. To do this you'll need to install Jekyll (which itself needs Ruby and rubygems installed):

    gem install jekyll

You can then run:

    jekyll serve

And visit `http://localhost:4000` to see the site live.

### YAML Syntax

The post you write should have a block of YAML at the front that looks like this:

    ---
    layout: post
    title: "My Post Title"
    author: Jack Franklin
    author_twitter: jack_franklin
    ---

By adding the `author` and `author_twitter` fields, you post will be accredited to you, and not to me! If you'd like to be credited differently, please get in touch. I'm happy to chat about it.

