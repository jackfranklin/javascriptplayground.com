---
layout: post
title: Migrating complex JavaScript applications
intro: A write up of a conference talk given about lessons learned migrating complex JavaScript applications.
githubPath: 2017-08-07-migrating-complex-javascript
---

This blog post is a write up of a talk I've gave at Front Trends in Poland, May 2017. You can find the slides and video below, along with a full write up of the talk, if you'd rather read than watch.

<iframe width="640" height="360" src="https://www.youtube.com/embed/QVna1-9yMuA" frameborder="0" allowfullscreen></iframe>

You can also [find the slides on SpeakerDeck](https://speakerdeck.com/jackfranklin/front-trends-migrating-complex-software),

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

![](/img/posts/migrating/tree.png)

By taking this approach, we were able to ship aggressively - the first part of our codebase to be written in React was shipped on day two of the migration.

## Tests

Throughout the process we needed to ensure that we didn't break the application. It's not possible to deploy migrated code multiple times a week without a suite of tests to confirm that functionality hasn't broken. The existing Angular app had a lot of tests which helped; and we were able to convert tests from Angular to React (written using Jest and Enzyme - [which you can read more about here](https://www.sitepoint.com/test-react-components-jest/)). However, when you've migrated tests over, that doesn't confirm that you've not broken anything in the process of migrating. What was really valuable to us was a set of end to end tests, written using [Protractor](http://www.protractortest.org/#/).

We were even able to run these tests in IE11, checking that we were supporting IE correctly and not inadvertently causing cross browser bugs during the migration. The advantage of these tests is that they are entirely decoupled from the code; they care not if the UI they are interacting with is Angular or React based and that's the best thing about them. The downside of these tests is that they are slow - so we stuck to having five tests that covered the core user journey and interactions. It's important to find a balance of test coverage versus test speed.

## Team

One of the biggest areas of learning for me in this project - and one that I don't tend to blog about much - was the lessons learned about working in a team on one project for such a long period of time. Working for an entire year on the same project was a new experience - normally I work on teams that work on a particular goal for 2-3 weeks and then move onto the next.

One of the most important aspects of this was knowing what to work on. We had a vast codebase to pick from and ultimately everything needed migrating. How should we pick and choose what parts to tackle first? The first step was to vet every single feature and check that it was still something that we needed to support. We found a fair few parts of the codebase that had never been used, or supported features we no longer needed, and this lead to us deleting a lot of code. This took time to go through and decide which features were needed, but that time was very effective compared to the alternative; migrating features that would never be used would have been no good to anyone.

After we'd got rid of all the code we didn't need, we based prioritising components on three factors:

- the bug rate - a buggier feature got higher priority as we could fix bugs as part of the migration.
- the code quality - code that we didn't understand was higher priority; getting rid of code no one understood was a large motivation for the entire migration.
- the churn rate - that is, how many times per week that a particular part of the codebase was used. Code that is touched more by more developers is more important to migrate - we want to spend as little time as possible working with or maintaining old Angular code.

Given these three factors we could prioritise work:

![](/img/posts/migrating/churn.png)

We also made sure to mix up different types of work. Some parts of the migration were more visual based - moving one small Angular component to React - and some were more "under the hood", such as moving the HTTP layer from Angular's `$http` service to using the `fetch` API. Others were purely tooling based; we used the migration as a good excuse to bring the tooling up to speed and moved from Browserify to Webpack, and migrated tests from Karma to Jest. We made sure that as a team each developer got as much variety in the work as they could (based on their preferences, too) because otherwise we risked the work becoming very monotonous; there's only so many times you can migrate small components from Angular to React without feeling a bit bored!

One key to keeping the team motivated was to ensure we kept our momentum up at all times. To do this we would aggressively ship new React code on an almost daily basis, backed by our test suite to ensure no breakages as we deployed. This enabled us to really feel like we were making progress and even on larger pieces of work we would try to deploy in stages to keep things ticking over. This also reduces the risk significantly - if you're deploying small pieces one at a time and something breaks, you know exactly which deploy (and therefore which code change) caused it.

To help us visualise the change we had a variety of scripts that would give us very rough metrics on the codebase. One would grep the codebase for files that imported React, and another did the same for Angular. This gave us an (incredibly rough) overview of our progress, and whilst not scientific, it was great as a team to see the numbers change as we worked.

## Talking

When we first started considering a large software migration we communicated throughout the tech team as to the reasons why and how long it would take. When communicating amongst the tech team, it's natural to use specific terminology and discuss to a fairly in-depth technical level. Where we made a mistake initially was not communicating clearly with the teams outside of engineering. These teams are arguably more important to get onside; they are the ones who deal with angry customers who couldn't buy tickets, or deal with management teams who want to use our product. They are the ones who get regular feedback on the negative aspects to our product, and they are the ones who get angry phone calls if a certain feature doesn't work right. Early on we didn't communicate our motivations for the migration in a clear manner, and as such didn't get much support outside of engineering. Most people were (understandably) frustrated when they were told that for a year we would primarily be keeping our product the same and just changing the underlying code.

To fix this it's important to switch your communication to be from their team's point of view; rather than discussing the pros of React versus the cons of Angular, it's important to explain the impact doing this migration will have on them. To do this we explained how bugs that are harder to fix now would be made easier when we moved to a framework and codebase we understood more; we explained how we could lose some of the bulky code that led to the product loading slowly on mobile devices, and we explained how we'll have greater confidence in the system and be able to react much more quickly to urgent requests, bug fixes and features. This really helped people outside of tech understand what we were doing and why we were doing it.

Our method for prioritising migrations based on bugs also paid off here - we were able to take long-standing bugs that had caused customer support (and our customers) pain, and fix them whilst migrating from Angular to React. One such bug that caused us issues constantly had existed for nearly a year, unable to be hunted down, and was eradicated when we migrated the relevant components over to React. This made us happy and made customer support even happier! Fixing bugs that caused other teams pain clearly presented to them the benefits of doing this work, and why the downside of not building as many new features was worth it in the long run.

Another area of communication that we put a lot of time and effort into was communicating when things went wrong. Ultimately on a complex project over a relatively long time period there would be bugs caused by the migration. 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">There are two types of ops people: those who have fucked up production, and those who are about to. <a href="https://twitter.com/petecheslock">@petecheslock</a> <a href="https://twitter.com/hashtag/monitorama?src=hash">#monitorama</a> <a href="https://t.co/TMpdvW1Wqs">pic.twitter.com/TMpdvW1Wqs</a></p>&mdash; (╯°□°）╯︵ ┻━┻ sdoɹǝǝq (@beerops) <a href="https://twitter.com/beerops/status/866808660030345218">May 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This is frustrating to everyone but the artist services team who get phone calls from angry clients about the site being down really get it more than anyone else, so would understandably be very upset when this happened. Every time we caused an issue we did a full internal retrospective and discussed how it happened. We asked:

- __What__ went wrong?
- __Why__ did we not catch it before deployment?
- __How__ did we fix it?
- __How__ will we prevent this happening again?

Importantly this was entirely blameless - if a bug made it out to production it wasn't the responsibility of the person who wrote the code, but the entire team. Often we'd find that bugs highlighted a gap in our testing, or some manual testing that needed to be done before certain deploys (one particular date bug only showed itself on the New York time zone, so tracking that down in London was hard!).

The lessons learned would then be communicated to the rest of the business, to show them that not only did we take issues on the platform very seriously, but we spent a lot of time and effort making sure the same bug never happened again.

## Conclusions

In summary, there are 7 key lessons learned that you should have in mind if you're ever thinking of migrating a project:

1. Never migrate just for the sake of it - if our only motivation had been because the product was on Angular 1, we wouldn't have done it. There were multiple factors that lead to us migrating. Don't take this decision lightly!
2. Plan, plan and plan again. We spent many hours in front of a whiteboard breaking the product down and prioritising features. Have the prioritised work visible to the team (we used Trello), so you don't ever lose focus, which is easily done on such a complex, long running project.
3. Cross business communication is vital.
4. Prioritise based on current pain points in your application, which helps with motivation and keeping the rest of the company onside.
5. Mix up different types of work to keep the work interesting for all team members.
6. Have some metrics, however rough, for the migration, so you can easily get a sense of where you are and your progress.
7. Don't expect to migrate perfectly the first time - you can refactor after migrating.

If you have any questions, I'd love to answer them! Feel free to [grab me on Twitter](http://twitter.com/Jack_Franklin) or [open an issue on GitHub](https://github.com/jackfranklin/angular-react-talk).


