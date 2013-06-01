---
layout: post
title: "Cross Browser Testing with bunyip"
---

Today we're going to take a look at [bunyip](https://github.com/ryanseddon/bunyip), a tool from [Ryan Seddon](http://twitter.com/ryanseddon) to make running your test specs in multiple browsers really easy.

Out of the box, bunyip only supports the YUI Test framework (this is due to the fact that Yeti, the tool bunyip uses, only supports YUI) but Ryan has written adapters for QUnit, Mocha and Jasmine. In this tutorial I'll take some Jasmine specs and run them through bunyip, using Ryan's Jasmine adapter. The specs are going to be from my [Testing With CoffeeScript](https://efendibooks.com/minibooks/testing-with-coffeescript) ebook, which is free and if you haven't checked it out yet, I'd love it if you could give it a read and let me know your thoughts.

bunyip is easily installed through npm, as a global module:

	npm install -g bunyip
	
To run bunyip locally, simply run:

	bunyip -f yourspecs.html local
	
The file you point bunyip to should be your spec runner, so for Jasmine users it's the SpecRunner.html file. The `local` option tells bunyip to run local browsers. It's pretty smart about how it does this, and will look for the following browsers:

* Firefox and FF Nightly
* Chrome and Canary
* Opera and Opera Next
* Safari
* PhantomJS

Before we run bunyip, lets use Ryan's Jasmine adapter for Yeti, which is what bunyip uses to run the tests. 

In the top of the spec runner file, just below the line that sources Jasmine, add in a line below to include the Jasmine adapter, which you can [find here](https://github.com/ryanseddon/yeti-adaptors/blob/master/jasmine/jasmine-yeti-adaptor.js). I'd recommend downloading it and putting it into the same folder as the Jasmine source.

	<script type="text/javascript" src="lib/jasmine-1.1.0/jasmine.js"></script>
	  <script type="text/javascript" src="lib/jasmine-1.1.0/jasmine-yeti-adaptor.js"></script>




If you take a look at your SpecRunner.html, you'll see this section of JavaScript that runs the tests:
	
	(function() {
	   var jasmineEnv = jasmine.getEnv();
	   jasmineEnv.updateInterval = 1000;
	
	   var htmlReporter = new jasmine.HtmlReporter();
	
	   jasmineEnv.addReporter(htmlReporter);
	
	   jasmineEnv.specFilter = function(spec) {
	     return htmlReporter.specFilter(spec);
	   };
	
	   var currentWindowOnload = window.onload;
	
	   window.onload = function() {
	     if (currentWindowOnload) {
	       currentWindowOnload();
	     }
	     execJasmine();
	   };
	
	   function execJasmine() {
	     jasmineEnv.execute();
	   }
	
	 })();
	 
All you need to do is slot in this check that sorts bunyip out:
	
	if (window.$yetify !== undefined) {
	  BUNYIP.hookup(jasmineEnv);
	}
	
I decided to add this into the `execJasmine()` function:

	function execJasmine() {
	  if (window.$yetify !== undefined) {
	    BUNYIP.hookup(jasmineEnv);
	  }
	  jasmineEnv.execute();
	}
	 
Now we've got that sorted, head into the folder where your SpecRunner.html resides and run:

	bunyip -f SpecRunner.html local
	
You should get an output similar to this:
	
	Creating a Hub at http://localhost:9000
	Waiting for agents to connect at http://localhost:9000.
	When ready, press Enter to begin testing.
	  Agent connected: Chrome (21.0.1180.89) / Mac OS
	  Agent connected: Firefox (14.0.1) / Mac OS
	  Agent connected: Safari (5.1.7) / Mac OS
	  Agent connected: Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.6.1 Safari/534.34

bunyip finds the browsers you have installed (for me, it's Chrome, Safari and Firefox), along with PhantomJS. Once all the browsers you want have loaded, you need to press enter to run the tests. When you're happy, hit enter.
	
	Testing started on Chrome (21.0.1180.89) / Mac OS, Firefox (14.0.1) / Mac OS, Safari (5.1.7) / Mac OS, Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.6.1 Safari/534.34
	Testing... \ 0% complete (0/4) 52.15 tests/sec  
	Agent completed: Firefox (14.0.1) / Mac OS
	Agent completed: Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.6.1 Safari/534.34
	Testing... / 50% complete (2/4) 35.58 tests/sec 
	Agent completed: Chrome (21.0.1180.89) / Mac OS
	Agent completed: Safari (5.1.7) / Mac OS
	Testing... | 100% complete (4/4) 20.47 tests/sec 92 tests passed! (1417ms)
	
You'll see each browser briefly flash your specs page and then close again as all tests run, and pass in my case. If you want to run specific browsers, you can:

	bunyip -f SpecRunner.html local -l "firefox|phantomjs"
	
Which does indeed just run those browsers:
	
	Agent connected: Firefox (14.0.1) / Mac OS
	Agent connected: Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.6.1 Safari/534.34
	
This makes bunyip a great tool for quickly testing your specs cross-browser. I should also note that if you have a paid BrowserStack account, you can easily connect bunyip up to that which enables you to run your specs on all the devices Browser Stack supports, including IE and iOS devices. To find out more on that, I suggest checking out the [bunyip repository](https://github.com/ryanseddon/bunyip).
