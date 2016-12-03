---
layout: post
title: Features support: polyfills and conditional loading
intro: New features of the Web Platform are enticing and appealing to developers, but sooner or later we all crash against the Cross Browser Compatibility Wall. Should we give up on the shiny new features and wait on browsers to catch up? Hell no we shouldn't! Polyfills to the rescue.
author: Alessandro Menduni
author_twitter: mendaomn
author_img: 'https://avatars3.githubusercontent.com/u/11457067?v=3&s=460'
---

Sometimes you get excited by new possibilites offered by the Web Platform and start playing with promising new patterns, [as we did here with Custom Elements](https://westwingsolutions.com/articles/blog/image-inlining-element). New features of the Web Platform are enticing and appealing to developers, but sooner or later we all crash against the Cross Browser Compatibility Wall. Should we give up on the shiny new features and wait on browsers to catch up? **Hell no we shouldn't!** Polyfills to the rescue.

# Polyfills to the rescue
[Polyfill is a weird term](https://remysharp.com/2010/10/08/what-is-a-polyfill) indicating a JavaScript library aimed at implementing a specific HTML5 web standard that might be missing on the client's browser. It is supposed to expose to developers an API that works as closely to the standard as possible, while being completely transparent to the developers. What this means is that users of the polyfill should not be required to know whether or not the feature is being provided by a polyfill or not.

> A polyfill is a shim for a browser API (Axel Rauschmayer)

As an example, think of the Web Components. They rely, among other features, on Custom Elements to be available. What does this mean and what can a polyfill do about it? It means that, a developer willing to create a Web Component would want to write code such as:

```javascript
window.customElements.define('<my-element>', elemPrototype);
```

There's a fundamental assumption hidden behind this line of code: the developer is assuming the existence and compliance of the `customElements` object attached to the global `window` object. However, it might not hold true in those browsers that do not ship that specific feature. A polyfill basically implements the `customElements` object, as close to the standard spec as possible, and attaches it to the `window` object.

# What should you do?
So that's great but **how can a developer find, include and use a polyfill?** I'm glad you asked, I've got the specific example for you right here.

So, back to the custom elements example. First of all, **do I need a polyfill?** You should head over to [CanIUse.com](http://caniuse.com/) and see what's the state of browsers support; you can then take a look at [IWantToUse.com](http://www.iwanttouse.com/) in order to have an idea of how many of your users will be navigating your site on a supporting browser.

There's no golden rule here, you **could** get away without polyfilling most features, but you **shuold at least be aware of the trade off** you're taking. After having decided that you might need one, the more performance savy among you are already wondering:

> Right, but is it worth it loading in kilobytes of JS just to use a single feature? (The performance savy reader)

That's a great point, and this is precisely why I think it's important that, in most of the cases, you **conditionally load the polyfill** only in those cases that it's actually needed. As it happens, this is a tradeoff between two scenarios:
- **Scenario 1**: You ship the polyfill without checking the user's browser first: the loading time will increase slightly for all of your users
- **Scenario 2**: You ship the polyfill on-demand: those users that are already on modern browsers will have a faster loading experience, the others will have to wait on an additional roundtrip before they can enjoy your app

So be thoughtful and pick whatever strategy best suits your app. If you wish to conditionally load a polyfill you can easily do it by:
- **Feature testing**: check at runtime whether an API is available or not
- **Asynchronously load the polyfill**: fetch the code implementing the missing API

Here's a small implementation of this strategy.

# The feature test
Let's say you want to have access to the `customElements` API. You first want to check whether in the user's environment there is support for it: a simple check would look like:

```javascript
  var CUSTOM_ELEMENTS_AVAILABLE = ( "customElements" in window );
```

That's an easy one, you simply test if the "customElements" property is contained in the `window` object. It can get much messier than this, especially when the test needs to be adapted depending on the user agent. Anyway, I'd reccomend always refer to [our magic friend](https://google.com) in order to find the proper test to perform for your use case; if you plan on loading multiple polyfills, you should definetely rely on Modernizr, a great library that ships with an handy [online builder](https://modernizr.com/download?setclasses), which wraps a ton of feature detections for you in an easy API.

# The async loading
Now, that was the hard part. Loading the actual polyfill is pretty easy and basically looks like the following:

```javascript
var Loader = {
  loadIf( bool, url ) {
    if ( bool ) return;
    Loader.loadScript( url );
  },
  loadScript( url ) {
    return new Promise( ( resolve, reject ) => {
      var script = document.createElement( 'script' );
      script.src = url;
      script.onerror = reject;
      script.onload = resolve;
      document.body.appendChild( script );
    } );
  }
};

Loader.loadIf( CUSTOM_ELEMENTS_AVAILABLE, '/polyfills/customElements.min.js' )
.then( /* API available here */);
```

And that's it. You've got all of your users covered. Keep in mind that **this strategy may be an overkill** for a single and small polyfill, but it might become your new best friend if you're trying to support a dozen of different combinations of features in all modern browsers.

# Where can I find a polyfill?
In order to find the right polyfill(s) for your app you've got plenty of choices, ranging from investigating the documentation for the particular feature you'd like to shim, to reading StackOverflow threads, but here's my favourite couple of strategies:
- Check out [this list](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) mantained by the Modernizr's contributors
- Go advanced and give a try to [polyfill.io](https://polyfill.io/v2/docs/examples#feature-detection)

# Hope this helped!
As always, you can find the complete code sample [on GitHub](https://github.com/west-wing-solutions/blog-samples/blob/master/script-loader/loader.js). If this helped you in some way and you think this might be useful someone you know, please share it to **let this reach more people**! In conclusion, I would like to thank Jack Franklin for allowing me to share this post on this awesome site, and would love to hear your feedback on this type of articles. Did you find it helpful? **Let me know, by leaving a comment on Twitter!**
