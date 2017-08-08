---
layout: post
title: Migrating complex JavaScript applications
intro: A write up of a conference talk given about lessons learned migrating complex JavaScript applications.
githubPath: 2017-08-07-migrating-complex-javascript
---

This blog post is a write up of a talk I've gave at Front Trends in Poland, May 2017. You can find the slides and video below, along with a full write up of the talk, if you'd rather read than watch.

<script async class="speakerdeck-embed" data-id="f527ae61e3a84b8786e8522300af68f2" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

<iframe width="640" height="360" src="https://www.youtube.com/embed/QVna1-9yMuA" frameborder="0" allowfullscreen></iframe>

## Background

The application I worked on was a business critical ticketing platform that sold tickets to music gigs. You don't need to know any more about it to enjoy this blog post; the most important thing to note is that we had to be in a position to deal with sudden bug reports and new features that might be needed. This immediately ruled out any big bang rewrite, and instead we decided to build new components in React, and migrate existing Angular ones to React one by one. Since starting this project a year ago, I've learned a lot across a lot of different areas and that's what the talk and this blog post are about.

It's split up into the four t's: Tech, Tests, Team and Talking.

## Tech

The first decision we made was the one to move away from the existing Angular 1 codebase in the first place. We did not do this because we actively disliked Angular; I've worked with it before and very much enjoyed it, and Angular 2+ has made a lot of improvements. Our reasons for considering the migration were:

- Lack of expertise; both developers who had built the Angular app had moved on from the company.
- Lack of confidence; because we hadn't build the app, it was hard to have confidence that when we changed code we weren't introducing new bugs or breaking other features.
- Angular 1 is not the latest version of Angular and although it is going to be maintained by the Angular team for a while yet, it does not have the longevity we were looking for.

We picked React primarily because we all knew it well, but also because it fits the component model that we were betting on; that we could build our app incrementally, starting with very small components and then moving into larger ones as we gained confidence.

### Strangling Angular

We could either do a big bang rewrite, and start again entirely from scratch in React, or find some way to run Angular and React side by side as we migrated incrementally. As mentioned above, we had to do this because a big rewrite was out of the question.

There's another benefit of incremental migrations: you start to add value immediately. In a big rewrite, you only add value at the end of the migration, when everything is done. If you migrate piece by piece you add value every time you deploy some migrated code. This approach is known as the strangler approach, a term coined by Martin Fowler but one that I became aware of after a talk from [Sabrina Leandro at Lead Dev](https://www.youtube.com/watch?v=1QPEflWn1WU&list=PLBzScQzZ83I81fnpqX2AkYD5c5cKgrqc2&index=10).

![](/img/posts/migrating/value.png)

This approach of migrating from the inside out was made possible by [ngReact](https://github.com/ngReact/ngReact), an Angular plugin that lets you render React from within Angular applications. Our approach was to start with very small components, and then work our way up the tree of components, replacing each part as we went.

![](img/posts/migrating/tree.png)

By taking this approach, we were able to ship aggressively - the first part of our codebase to be written in React was shipped on day two of the migration.

## Tests

Throughout the process we needed to ensure that we didn't break the application. It's not possible to deploy migrated code multiple times a week without a suite of tests to confirm that functionality hasn't broken. The existing Angular app had a lot of tests which helped; and we were able to convert tests from Angular to React (written using Jest and Enzyme - [which you can read more about here](https://www.sitepoint.com/test-react-components-jest/)). However, when you've migrated tests over, that doesn't confirm that you've not broken anything in the process of migrating. What was really valuable to us was a set of end to end tests, written using [Protractor](http://www.protractortest.org/#/).

We were even able to run these tests in IE11, checking that we were supporting IE correctly and not inadvertently causing cross browser bugs during the migration. The advantage of these tests is that they are entirely decoupled from the code; they care not if the UI they are interacting with is Angular or React based and that's the best thing about them. The downside of these tests is that they are slow - so we stuck to having five tests that covered the core user journey and interactions. It's important to find a balance of test coverage vs test speed.

## Team

## Talking
