---
layout: post
title: "Things I was wrong about when I started programming"
intro: In today's post I want to talk about some things I thought to be true when I started as a programmer, or habits I had, that I've now changed as I learn and reflect on my career so far.
---

When I got my first job after university I was ready to get stuck in. Through
university and side projects I'd done a good amount of programming and thought
that I was more than ready for my full time career to start. Recently I've been
looking back and thinking that I definitely had some misconceptions, weird
approaches and inefficient ways of working. These are all things I wish I could
go back and tell myself - it would have saved a bunch of time having to learn
them the hard way!

I was inspired by a
[post on a similar subject by Monica Lent](https://monicalent.com/blog/2019/06/03/absolute-truths-unlearned-as-junior-developer/)
and thought it would be a good idea to write these down to share them with you
all.

Although these are things I ended up changing my opinion on, I'm still happy
that I made these mistakes. The best way for me to learn is to see one strategy
fail, reflect on why, and do it differently next time. If you're starting out,
don't be afraid of making mistakes. They are a great way to learn and improve.

## 1: Less code is not always better

When I started coding I had some hard rules about what constituted "good" code.
One of those rules was conciseness: if I could fit the same functionality into
fewer lines, that was an improvement. I've drastically changed my mind on this,
partly because I'd find myself revisiting code I wrote six months prior that
turned out to be a nightmare to understand.

Typically I find code that's been squashed up is more complex, uses tricks that
aren't common knowledge, and is also very hard to change. Given that most of a
developer's job is changing code, this matters. I am now very eager to extend a
function's body by a line or two if I can introduce more clarity to the code to
help me and my teammates understand it.

## 2: Work smarter, not harder

I worked _way too many hours_ in my first job. This wasn't the fault of the
company, it was solely my choice. I would work long into the night determined to
get that ticket finished before I went home. I then realised (and had feedback
from my manager) that I wasn't working smart; I was trying to take on a lot at
once, and ended up trying to do too many things and not focusing on any of them
fully. This would lead to all of them taking way longer than anticipated.

Once I was aware of this I was able to focus on doing fewer things well and
efficiently. I worked hard to get better at focusing in and being productive
during work hours so I got things done. I reduced my hours in the office by _a
lot_ but actually increased my output at the same time!

## 3: Some technical debt is OK

I came out of university thinking that only bad developers could create
technical debt. That in the real world all companies with good developers had
this beautiful codebase full of code that's easy to understand and follow. _How
wrong I was!_ At first I was intolerant of technical debt before learning that
every developer will be responsible for some during their career and that it's
an inevitable part of being an engineer.

I would come across "bad" code and immediately want to fix it or rewrite it. I
lost many hours doing just that. What I wasn't good at is _judging the impact_
of technical debt. Tech debt that's isolated to part of the codebase that
doesn't get touched much is fine, and you should just leave it there. Bad code
isn't bad code because it's written badly; it's bad code if it slows you down,
causes bugs for users, or constantly breaks. That's the code you need to fix.

## 4: Bad code isn't always the original developer's fault

This point is related to the one above; I would encounter bad code and my
immediate thought would be to lay the blame on the developer(s) who wrote it.
But this isn't fair; although when you come across bad code, it's easy to
`git blame` and hunt down the "culprit", it doesn't take into account the
_context in which the code was written_. Sure, that code might be bad, but:

* there might have been a must-hit deadline which meant the usual review process
  was skipped. Granted, if this happens often this would be an issue, but we've
  all had one-off deadlines that must be hit at all costs.
* the code might have been introduced as an emergency stop gap to fix a critical
  bug that was stopping users checking out, so quality was less important than
  fixing it.
* the code may have been written with future modifications in mind that never
  happened due to other work getting prioritised
* or the developer simply had an off day; I've come in to work and looked at
  code I wrote the day before in disdain before, it happens! We're all human and
  have off days.

## 5: Working is better than perfect

Due to the aforementioned misconceptions of technical debt and how it exists in
a codebase, I was always worried about introducing it myself. So when asked to
build a new feature I'd spend far too long trying to build _the perfect
solution_. This is incredibly inefficient - when trying to solve a problem you
are constantly learning more about the problem as you solve it - so the first
attempt is nearly always not going to hit the mark. It's far better to _get
something functional_ in place - and cover it with tests - before refactoring
and working towards a better solution.

It's also important to realise that _the perfect solution does not exist_. Any
solution will have pros and cons and the challenge we have as developers is
deciding on the best solution for the task at hand.

## 6: Software development is all about tradeoffs

I used to think that the best solution to a problem would have no problems. That
for every ticket or piece of work I was asked to do, I could solve it in a way
that had no negatives. Now I'm a bit older (and _maybe a tiny bit wiser_) I've
realised that there is no such thing as the perfect solution. The job of a
developer is to know what tradeoffs to make, because there are always going to
be tradeoffs. The best developers make the right tradeoffs that solve the
problems at hand and don't cause issues further down the line. _But_ they can
only make those tradeoffs and foresee problems _because they've made the wrong
choice many times_. So don't fret if you've made a refactoring that you thought
was great, but ended up causing problems, or implemented a bug fix which caused
your colleague hours of grief down the road. _We all have!_ The single most
important skill for a developer in my opinion is to be humble, willing to admit
that you made a mistake, but be eager to understand why your choice was wrong,
how you could have realised that sooner, and learn from it. If you do that
you'll be in a very good place.
