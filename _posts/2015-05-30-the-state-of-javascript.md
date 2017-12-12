---
layout: post
title: Predictions on JavaScript in the next 12 months
intro: Based on a recent talk I gave, in this blog post I'll discuss my thoughts on the current state of JS and what we might see over the next 12 months.
---

Recently I gave a talk called "The State of JavaScript" at the inaugural meetup
of the [London JS Community](https://twitter.com/london_js). You
can find the slides for this below:

<script async class="speakerdeck-embed" data-id="d15b87038dbc468ba94e31d0fef5118f" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

In this post I'd like to focus specifically on the end of the talk, when I
discuss my predictions for what we'll see happen in the next 12 months or so
with JavaScript. Be warned this is quite opinionated, and I don't expect people to
agree with everything I say! You should read this as "what Jack thinks" rather
than "what will happen". Find me [on Twitter](http://twitter.com/Jack_Franklin)
if you'd like to discuss things further.

# Predictions

I made 8 predictions on what I think we'll see in the next 12 months, and most
of these are influenced by the three core goals of ECMAScript 2015 (formerly
ES6), which hopes
to provide a better language for:

* complex applications
* libraries
* code generation (languages that compile to JS)

These are by no means the most bold of predictions, more so thoughts on what I
think will happen in the next year or so.

### 1: Fewer people will write JavaScript without a compilation step

We're seeing this trend already, libraries like
[TypeScript](http://www.typescriptlang.org/) and [Babel](http://babeljs.io/)
have built on what [CoffeeScript](http://coffeescript.org/) showed people
wanted, by building on top of JavaScript and compiling down to JavaScript.
CoffeeScript deserves a lot of credit here: it was the first project that really
did this and showed that people were willing to trade a slightly more complex
workflow for additional functionality.

Babel is slightly different in that all the new functionality it provides is
part of ECMAScript 2015 or beyond, so everything it implements in theory
will eventually be in the browser. Going forward, Babel, TypeScript and
[ClojureScript](https://github.com/clojure/clojurescript) will probably be the
three I'd back to become even more popular.

As an aside, I'm really interested to see what becomes of types in JavaScript.
TypeScript has proven that there's not only a demand but a strong argument for
having types in the language, and libraries like
[ImmutableJS](https://facebook.github.io/immutable-js/) have become very popular
too.

### 2: Smaller libraries (and the composing of) will be preferred over large frameworks

Alongside the larger, fully featured frameworks of Angular, Ember and others,
there's a myriad of smaller libraries that focus on doing one thing, and doing
it really well. You could even argue that ReactJS is a good example of this; as
a library it provides just the view layer for an application, and nothing more.
Given that npm provides a (relatively) easy way to install and manage all these
libraries, I think it will become more common for developers to construct their
own stacks of small libraries that can be swapped in and out, over using a large
framework where you're stuck with what it provides.

### 3: Focus on libraries that do one thing and one thing well

Related very much to the previous point, I think that there will be an even
bigger focus on the development and release of libraries that exist to solve one
problem, and do it very well. This feels like a natural process as an ecosystem
matures, and we figure out the best solutions to new problems (such as client
side "MVC" approaches). Why write an entire framework when you could write a
small library to plug the one problem you need to fix, and then couple it with
some other libraries that provide the rest of the functionality you need.

### 4: Large, fully-featured frameworks will remain rightly popular

The previous two thoughts might make you think that I'm predicting the demise of
Angular, Ember and so on. This is definitely not the case. There will always be
(and quite rightly so) a use case and need for these larger frameworks.

### 5: The use of compilers (Babel etc.) will be abstracted for us by generic build tools

More and more developers will use compilers like Babel, but they won't do it by
directly installing and running Babel. Most will use it through some other
system like [jspm](http://jspm.io) or [webpack](http://webpack.github.io/),
generic tools that abstract away the compiling step and provide all the
functionality you could ever need.

### 6: Running the same JavaScript client and server side will be common

There are a lot of benefits to running the same application on your client and
server. At GoCardless, we just launched the new gocardless.com, a ReactJS
application that runs on client and server (we [blogged about how we did
it](https://gocardless.com/blog/how-we-built-the-new-gocardless.com/)) and it's
gone really well. I expect that tools will grow out to serve this demand and
that the approach will be refined over time.

### 7: As ES2015 implementations complete, we'll be writing ES7 already

Tools like Traceur and Babel (initially called 6to5) initially existed to let us
write ES2015 ahead of it being fully supported across browsers. However they
have since grown to support upcoming features of ECMAScript7 and beyond. I can't
see a time where we won't run our code through something like Babel, because by
the time ES2015 is fully implemented, the next version of the language will be
well under way. In fact, this is a good thing, because it should let new proposed
features be tested by developers before they are implemented. The feedback loop
should be quicker as a result of people writing ES7 way before release and that
can only be a benefit to everyone involved.

### 8: The rate of new frameworks will begin to slow down

Framework booms are to be expected when a new approach to web development comes
along. The swap to client side applications really began with BackboneJS, before
many others came along. Every week it felt like a new framework hit the internet
but recently to me it feels like that's slowed down a little. Angular and Ember
have emerged as the two most popular options, but we've not seen as many new
options really catch on. I think as we've figured out the best approaches for
building and architecting client side applications, we've picked out frameworks
and stuck with them. That isn't to say another framework couldn't come along, but
I'd be surprised if in 12 months the focus isn't still on the frameworks that
we're using at the moment.

# Conclusion

They're my thoughts on what we could see happen over the next 12 months or so,
and I'd be keen to hear what everyone else thinks. I'm pretty sure that I'll get
things wrong, too! There are also other things I'm interested to see more of
once they are released, including Facebook's work on [Relay and
GraphQL](http://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html).
It's hard to say much about the tools when they have yet to be fully open
sourced, but I've no doubt they will have an impact when they are.

_My thanks to [Max Murdoch](https://twitter.com/maxalfiemurdoch) for his
reviewing of this post._
