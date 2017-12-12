---
layout: post
title: The state of front end tooling
intro: A post on my thoughts about the state of tooling in JavaScript
---

There's been a lot of posts written recently on the web about the state of tooling in front-end development and the opinion that many share that the environment has become overwhelming both for the beginner developer and the more experienced developer.

At [Future of Web Apps 2015](https://futureofwebapps.com/london-2015/) I watched a really interesting talk from [Peter-Paul Koch](https://twitter.com/ppk) in which he argued that our tooling problem has become an epidemic; and that we should stop encouraging the creation of new tools and libraries. After my talk at FOWA, in which I demoed building applications using [jspm](http://jspm.io), [SystemJS](https://github.com/systemjs/systemjs) and [Babel](http://babeljs.io), I had an attendee question if the addition of jspm was warranted. It's a perfectly reasonable question and one that got me thinking.

## Tools for tool's sake

I explained to the attendee that I use jspm because it solves a problem that I don't want to have to deal with. In this case, jspm lets me install 3rd party modules from npm and GitHub without me having to deal with configuration or any form of additional build tool, and it also provides the bundling functionality when it comes to deploying my application. Yes, I pay the small overhead of adding another tool, but I can justify it.

The problem and confusion comes from using tools just because they exist or because they're the "new shiny" toy that has come along. If you're adding a tool to your workflow just because someone on the internet said you should, you're going to hit difficulties. You need to strenuously vet tools before deciding that you're happy to have them as part of your set up. The way you would do this is by using a tool on a project ultimately, but not without doing some research first. Most projects will provide examples of using them and you should try to marry those up with your project. If you find yourself struggling to explain to a colleague why you think this tool will be a good addition, it's likely that it isn't. Don't force a tool upon an application that it's not suited for. This isn't just true for package managers like jspm, but frameworks, polyfills and any form of 3rd party item you might include.

Additional criteria you might check to decide if a tool is right for you and your project might be:

* is the project active? This does not mean "committed to in the last three / six months", but is there a community around it? An active Slack / IRC channel or some form of discussion? Are there many GitHub issues, and are new ones replied to relatively quickly?
* do you know other developers using it? Being able to speak to someone who is heavily invested in a tool is a great way to get information quickly. Additionally, you'll have more luck bringing other developers into your project if you're picking tools more people are behind and using.
* do resources exist to help you use it? Are there answers on Stack Overflow, tutorials on other blogs or conference talks you can use when you're first learning the tool?
* is it well implemented? You don't have to learn the source code in depth, but there's other ways to judge this. Has the library been split up into multiple files, are there some tests? Are any pull requests carefully considered before being merged? Does the maintainer carefully tag releases and version their releases properly?
* does the project's README provide a good starting point? It should explain the motivations behind the project, some examples of its use and links to thorough documentation, tutorials and more.

You should also forget about trying to "keep up" with the web as more and more tools come along. Tim Kadlec talks about this in his blog post ["The Fallacy of Keeping Up"](http://timkadlec.com/2015/09/the-fallacy-of-keeping-up/), which I recommend reading. It's just not worth your time and effort to try every tool as they come out and chop and change. Recently someone asked me if they should leave Grunt to try something else like Gulp, and I asked them what problems they were having with Grunt. They weren't having any, but this person had been told by many that they should consider swapping over. Yes, it's true that if you're relying on a tool that's not been maintained for years you might consider moving over, but don't let that decision be a knee jerk reaction. We have a skewed view in this industry; an "unmaintained" project on GitHub is one that's not had a commit in three months. Think longer term, and don't be afraid to stick to the tools you trust. You should end up with a tried and trusted toolset that you rely on time after time. For me and the projects I work on that's jspm along with ESLint and a couple of others. For you it might be Grunt, JSHint and CoffeeScript. It doesn't matter, as long as you can justify each of them to me and spend the time to build up your knowledge and understanding of them.

## Complexity is inevitable

It's been said time and time again that our tooling setup has gotten incredibly complex, and that it's made the web much more daunting for new developers. There's definitely some truth to this - when most of us started writing JavaScript we created an HTML file, added a `<script src="app.js"></script>` and wrote our JavaScript in `app.js`. We would then open that file in our browser of choice and that was that. If you search for beginner tutorials today a large number of them will introduce you to npm, Sass or some other framework that sits atop the base layer of HTML, CSS and JavaScript (ES5, not ECMAScript 2015).

For me, that is **still** the baseline and the one that we should adhere to when introducing new developers to the ecosystem. There's no doubt in my mind if I'd have had to install Node, run Babel, or set up any other tool, I would probably have given up. I can remember struggling to install Ruby on my machine, something that today I take for granted. We all started from somewhere, and for new developers that somewhere should be an HTML file loaded into a modern browser with one JavaScript file. As that person grows in confidence and knowledge we can begin to layer these tools on top. Additionally, that person's new found knowledge will enable them to start being able to accurately judge if a particular tool is of interest to them and applicable to their project. Beginners don't know if a particular tool will suit their project, or if that tool is going to be one they can rely on. Being able to make that call is something that comes with experience, and we shouldn't force tools onto people until they're in a position to make the call themselves if it's a good decision or not.

As we move more and more functionality to the client, part of the trade off is that we end up with a more complicated tooling set up. If you ever work on a server side language you'll meet a bunch of tools that have grown out of the requirement to tackle the requirements of authoring and working with a large application. Traditionally in the past we've never had to deal with that, and hence there's never been much of a need for a complicated tool chain. Now we're building full, stateful applications in the client, it's inevitable that we'll need some extra tooling to help us, and we shouldn't be afraid of that.

## The wrong type of tools

I don't think that we're creating too many tools - not only is it great to have a variety, it also encourages competition and improvement. ReactJS is a great example of this; since its introduction and adoption other frameworks like EmberJS have embraced React's virtual DOM model, and others will follow suit too.

What's more interesting to me is the type of tools we're creating. I'm a big believer of the Unix philosophy: each tool should do one thing, and do it well. This is definitely something we can take into our approach with web development tools. Every individual tool that you add to your project should be able to have its functionality summed up succinctly. We shouldn't look to use or to create tools that attempt to do everything. This is partly the reason ReactJS has been adopted so quickly - its surface area is very small, and the functionality it provides is well defined. This is partly the reason I've stopped using task runners like Gulp or Grunt, and instead prefer to install many smaller modules that each provide a small piece of the puzzle. Of course, I could use Gulp given that all its functionality comes from plugins, but I don't need that additional complexity. You might, and if you do, that's great. I'm not saying there's anything wrong with Gulp, larger frameworks like Angular, or tools that provide a range of features. As we go forwards though we should make a concerted effort to build tools with smaller surface areas. The benefits of this are huge:

* tools with smaller surface areas are much easier to pick up, and much easier to master
* using a variety of smaller tools means you can swap one out for another with less effort if you find a better option
* it's easier for people to create but more importantly maintain smaller tools
* it's much easier to experiment with a smaller tool - you don't have to rewrite huge parts of your application. This makes it easier to gauge quickly if a tool is right for you or not
* small tools can be composed together to create a larger system. Smaller tools are interopable by default, there is no larger ecosystem defining an API that everything must adhere to. Let each tool do its job, and compose them together to achieve the desired result.

## Conclusion

I hope that this article provides some food for thought, and I'd really love to hear what you think. Please feel free to [drop me a tweet](http://twitter.com/Jack_Franklin), I'd really like to discuss the issues of tooling and what we can do going forward to ensure we head in the right direction.

Thanks to Alex Young, Shane Hudson, Adam Onishi, Ruth John and Peter Müller for their review of this blog post.
