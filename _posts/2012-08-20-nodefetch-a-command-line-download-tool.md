---
layout: post
title: "nodefetch, a command line download tool"
---

As part of me wanting to spend some time playing with command line Node.js tools, last week I sat down and wrote [nodefetch](https://github.com/jackfranklin/nodefetch). Whilst I don&#39;t usually blog about my projects on here, I thought this one might be of use to a few people, so thought I&#39;d quickly write up about it. If you enjoyed last week&#39;s tutorial on [creating a command line Node tool](http://javascriptplayground.com/blog/2012/08/writing-a-command-line-node-tool), this is a great chance for you to dive into the source of a little more complex tool. 

Once installed through NPM with `npm install nodefetch -g`, you are able to download the latest copy of jQuery into your present working directory as easily as: 

    nodefetch jquery

You could also download multiple files:

    nodefetch jquery backbone underscore 

Isn&#39;t that awesome? I think so and a few folks I shared it with liked it too.

It works by keeping a `.nodefetch.json` file in your home directory that links package names to their downloads. When you first run nodefetch it will download the default file from my own server, but you are then free to edit it to add your own packages to suit you. 

There&#39;s more detailed instructions on Github involving how nodefetch is tested (I even wrote another npm package to help me test it) and how to contribute if you&#39;d like to help out. I&#39;ve got plenty more planned for nodefetch and if you do find it useful I&#39;d love for you to let me know. Similarly, if you look through the source and see anything you don&#39;t understand, feel free to ask.
