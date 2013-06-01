---
layout: post
title: "Talking RequireJS at TakeOff Conf"
---

So this week I attended my first conference outside of the UK and travelled to a freezing Lille, in Northern France (it's been below freezing every day!) and spoke on [RequireJS](http://requirejs.org), something I have [written about before](http://javascriptplayground.com/blog/category/requirejs).

In the future I will be doing a screencast on RequireJS in detail but for now I wanted to post up the slides and talk about the talk a little. [You can view my slides on SpeakerDeck](https://speakerdeck.com/jackfranklin/requirejs-take-off-conf).

The main thing I said in my talk with RequireJS that I wanted to reiterate is that when you first start it, you'll probably get frustrated. I know I did. The tipping point for me was when I figured out how to shim. When you first use Require it's tempting to just ditch it when you encounter a non-AMD compliant library (such as Underscore), but shimming it is so simple:

	require.config({
		shim: {
			'lib/underscore': {
				'exports': '_'
			}
		}
	});
	
Something [@mheap](http://twitter.com/mheap) pointed out to me that once you have an optimised JS file, you can swap out the RequireJS source for [Almond](https://github.com/jrburke/almond), a much more minimal AMD API that you can include into your build file - check the Github link for instructions on how to use.

I'm a huge fan of RequireJS and it's now very rare that I start a new JS project without utilising it.
