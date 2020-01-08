---
layout: post
title: "Frontend tech choices I'm making in 2020"
intro:
  "Today I'm looking forward to some of the technology that I'm most excited
  about using or experimenting with in the next year."
---

Happy New Year! The world of frontend web development is continually changing
with new technologies, ideas and frameworks springing up all the time. Whilst
this can get overwhelming, it's also an exciting space to be in with so much
opportunity to try new things. Today I've picked out a few libraries, languages
or ideas that I'm looking foward to trying in 2020. Some of these aren't
necessarily the new shiny thing - TypeScript has been around for a while now -
but they are all things that I think might make a big impact on the community in
the coming months.

> I'd love to hear what you're excited to work with or try in 2020!
> [Tweet @Jack_Franklin](https://www.twitter.com/Jack_Franklin) and let me know
> 😊

## TypeScript

In 2019 I had some mixed experiences with TypeScript. I started rebuilding
[test-data-bot] in it (and [did some screencasts of the
process][ts-screencasts]) but on another React project ended up removing
TypeScript completely, which you can hear more about on [Episode 8 of Fish and
Scripts][fish-and-scripts-8].

Where I've landed with my opinions _for now_ is that TypeScript for me is going
to be very beneficial on standalone JavaScript libraries, like test-data-bot,
but the trade off of TypeScript's compiler catching errors compared to the
amount of hard debugging of obscure error messages when working on a large
application with many dependencies is not worth it. In my large React project
where I eventually removed TypeScript I spent more time debugging odd type
issues with React and Apollo and other dependencies than I did writing actual
application code.

> I know the TypeScript team are aware that sometimes TypeScript's errors aren't
> the most readable so work in this area may well make TypeScript an even more
> compelling choice.

## Svelte

Hardily a controversial choice, [Svelte 3][svelte] has picked up a lot of well
deserved interest since its release. If you've not come across it I recommend
[Rich Harris' talk at YGLF][rh-yglf] as a great taster.

What I really like about Svelte is that it's a _compiler_. This means that when
you hit save in your editor the compiler runs and converts your Svelte
components into JavaScript code that is then executed in the browser. This isn't
what a framework like React does - in React you write JavaScript (or sometimes
JSX that is converted to JavaScript) and execute that in the browser.

Being a compiler, Svelte is able to spot potential issues at compile time and
let you know about them, aiding developer debugging. It's also really good at
shipping the smallest amount of JavaScript possible because Svelte is able to
take your components and intelligently compile them down into the smallest, most
performant JavaScript that it can.

I also love some of the defaults that Svelte ships with, primarily that CSS is
entirely scoped to each component by default. This is my preferred way of
writing CSS and it's refreshing to work with a tool that ships this out of the
box. It's a small thing but it's refreshing to not have to configure a build
tool to enable CSS Modules and instead just have the Svelte compiler do all the
work.

## Rollup

Doing some reading into Svelte also leads naturally into [Rollup], a JavaScript
module bundler written by Rich Harris who is the creator of Svelte. I like
Rollup because it feels very approachable; it's very easy to create your first
bundle and very easy to add a plugin to solve a common problem such as bundling
CSS or using Babel.

What's really impressed me with Rollup recently is how easy _writing your own
plugins is_. This has always felt like something far beyond my capabilities in
other tools - Webpack has felt like this black box to me and I would never
consider writing a plugin for that. Rollup on the other hand has good
documentation but also the Rollup plugins you find online (many of them written
by the core team) are very easy to look at and follow. The prospect of using a
bundler that I can manipulate and customise fully to suit my specific needs is
very exciting.

<blockquote class="twitter-tweet" data-lang="en-gb"><p lang="en" dir="ltr">working with Rollup has been really fun - and is incredibly easy to customise with plugins. Checkout the source code if you&#39;re interested - it&#39;s very straight forward and way easier than you might think.</p>&mdash; Jack Franklin (@Jack_Franklin) <a href="https://twitter.com/Jack_Franklin/status/1211717795085504516?ref_src=twsrc%5Etfw">30 December 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I'm excited to work with Rollup on some projects in 2020 and see how it
develops.

## Cloud databases

I have worked as and still can build backend applications but these days for
side projects I'm often keen to shift as much of the work as possible to other
tools to let me focus on the bits that I enjoy doing the most, and make it more
likely that this side project will ever see the light of day! I've always
defaulted in the past to [Firebase] because I'm familiar with it and it's fairly
easy to work with once you're used to the core concepts, but I've always had a
bit of a gripe in that the JavaScript libraries you need to use are quite large
in file size. This is definitely an area where I'd like to find other tools that
solve this problem and make it easy to host a frontend app that requires an API
/ database without having to build and host it myself. Recommendations welcome!

## Letting tools make choices for me

I've noticed a trend in the tools that I like: they make choices for me. I'm a
fan of Svelte (or at least, a fan enough to want to get more familiar with it)
in part because it makes nice choices out the box and decreases the amount of
thought required in getting a Svelte project running. I continue to be a strong
advocate of [Elm] because the language makes decisions for me and helps prevent
silly bugs from creeping in. I maintain that [Prettier] has been the most
productive change to my toolset in the last couple of years _because it makes so
many formatting decisions for me_.

I don't miss spending hours configuring Babel and all the myriad of plugins
required to get the exact set of features I want to have supported (to be fair,
`@babel/preset-env` has made this much easier). I don't miss trying to decide
what variant of CSS to use on this project. I've become a fan of putting more of
that burden onto the technologies I'm chosing such that I can focus in on the
actual application. I would be surprised if the tools that catch my eye in 2020
aren't ones that follow this pattern.

## What tech are you excited about in 2020?

Let me know! It's so hard to narrow down to just a few and I'm sure there's many
that I've missed. All suggestions are welcome and I'd love to discuss with you.
Drop me a tweet!

<!-- prettier-ignore-start -->
[test-data-bot]: http://github.com/jackfranklin/test-data-bot
[ts-screencasts]: https://javascriptplayground.com/typescript-videos-test-data-bot/
[fish-and-scripts-8]: https://fishandscripts.com/episode/season-1-episode-8-untangling-typescript/
[svelte]: https://svelte.dev/
[rh-yglf]: https://www.youtube.com/watch?v=AdNJ3fydeao
[Rollup]: https://rollupjs.org/guide/en/
[Firebase]: https://firebase.google.com/
[Elm]: https://elm-lang.org/
[Prettier]: https://prettier.io/
<!-- prettier-ignore-end -->
