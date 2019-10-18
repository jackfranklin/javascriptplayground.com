---
layout: post
title: "Using Windows 10 and WSL for frontend web development"
intro: "It's been about six weeks since I took the plunge and picked up a Dell XPS with Windows 10. Today I'm sharing my experiences, both good and bad, of moving to Windows 10."
---

I've been an exclusively Mac developer ever since I bought a second hand MacBook
(remember the all white, plastic ones?). I absolutely loved it and as I got more
into software development and discovered the terminal it became hard for me to
see how I could go back to Windows.

When I started my first full time engineering role the company provided a
MacBook Pro and a Cinema Display. This was so exciting! Over the next few years
I was provided exclusively with MacBook Pros to work on (which I recognise is a
fortunate position to be in).

When Apple released the latest iteration of the MacBook Pro, with its touchbar
and keyboard woes, I did begin to wonder if Windows was going to end up being
something I'd have to try. Reviews online and from friends and colleagues who
had these MacBooks were not positive. About a year ago I was due a new laptop
and work and was given the newest MacBook Pro, at around the same time I was
starting to think about buying a laptop myself so I didn't rely on my work
machine for personal projects. I'm also an Android phone user, so I'm not
invested into the Apple ecosystem as others which makes the potential swap to
Windows easier, I think.

_The rest of this post is very much based on my opinions: none of this is a
recommendation on what you should do. We all have different preferences and
opinions on which hardware and software combination is best for us._

Sadly I've not found the experience of the MacBook Pro to live up to either its
"Pro" naming or its "Pro" price point. Whilst I think I'm in the minority of
people who actually don't mind the butterfly keyboard I've found the software to
have some constant issues that I've struggled with. I've had the MacBook
completely shut down whilst running a workshop for 40 people because it told me
it was charging the battery despite not. I have to hard reset the machine when I
try to wake it from sleep at least once or twice a week in order to get anything
beyond a blank screen (the first time it did this I thought it had broken). I've
had regular issues with the HDMI dongle (and yes, I did pay full price for the
official Apple dongle 😢) and it not connecting properly to external screens. As
someone who does a reasonable amount of talking and teaching this has become a
real issue to the point where I considered taking a _backup laptop_ because I
didn't trust the MBP to work properly.

## Windows and WSL

I'd been following the work on WSL (Windows Subsystem for Linux) for some time
and found it a very compelling prospect; being able to run a Linux distribution
from within Windows could be a great way to make Windows more feasible for the
development work I do. Coupled with the
[VS Code WSL plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl),
which makes it seamless to run VS Code with files from that Linux subsystem, I
felt it could be a viable alternative.

## Taking the plunge

So I decided, given my MBP frustrations, to go for it. I did some research into
machines and went for a Dell XPS, which are regularly given very high reviews
online. Some (non-engineering) colleagues at work have them and spoke highly of
the machine. It worked out at ~£1000 less than the MacBook Pro cost, which I
figured was a very good saving - but only if I could work effectively on the
machine.

## Getting started with WSL

I didn't really have a clue where to start with setting up the Windows machine.
I was fighting years of Mac muscle memory and took to Google to find posts to
point me in the right direction.
[Dave Rupert's post on webdev with Windows](https://daverupert.com/2018/04/developing-on-windows-with-wsl-and-visual-studio-code/)
was the best blog post I found and really helped explain some things and point
me in the right direction. However, that post was written in early 2018, and
somethings have changed which means the steps are simpler now. Dave mentions
needing to install Git on the Windows side so VS Code can find it, but with the
VS Code WSL plugin that's not needed as it plugs into the `git` that you have
installed on the Linux side. I also referred to the
[official Windows WSL installation instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10),
using those to verify if a blog post was up to date or not.

## The terminal

I've been a solid fan of iTerm2 for a long time and was struggling to find a
terminal on Windows that could get close to it. I tried a few before discovering
that the next big update to Windows will include a brand new terminal app! Even
better, you can download it now from the Windows store. The
[Windows Terminal](https://github.com/Microsoft/Terminal) has provided me with
everything I need; it can easily be configured via JSON (so I can get my custom
font in there just fine) and you can configure it to automatically connect to
your Linux distribution when it starts up, saving the need to type `ubuntu`
everytime you fire up a command line prompt.

## Seamless workflow

The new terminal, coupled with VS Code and the Remote plugin, gets me an
experience on Windows 10 that's pretty much identical to my Mac workflow:

1. Fire up a terminal.
1. Navigate into the project directory.
1. Run `code .` to load VS Code with that directory active.
1. Let the VS Code Remote plugin connect (this is normally quick so doesn't
   cause any delays).
1. Start coding!

Everything within VS Code works perfectly; if I pop open a terminal there it
will be in my Ubuntu WSL, I can use the Git UI without any fuss, and extensions
run just fine too. I've yet to hit any snags with this workflow.

## The frustrations

The above might make it sound completely plain sailing but there have been
teething issues along the way that are worth considering if you're thinking of
trying the swap to Windows:

* It's a known problem that file reading/writing via WSL is much slower than it
  should be. This is due to a limitation of how WSL works. The great news is
  that WSL2 will fix this, but it's not out yet (unless you run an "Insiders"
  build of Windows 10 that is slightly less stable). In practice I don't find
  slow read/writes to be much of an issue but you can notice it, particularly if
  you're npm installing.
* This is more on me than on Windows but having used OS X exclusively for so
  long it's taking some time to get used to Windows and its keyboard shortcuts.
  It was definitely a few weeks before I felt comfortable and had found some 3rd
  party apps that helped replicate some apps from OS X that I was missing. If
  you take the plunge be prepared for a bit of frustration as you and your
  muscle memory adapts.
* I miss the Mac trackpad. The Dell one is perfectly good, but it's not quite as
  nice to use. That said the _keyboard is so much nicer!_ so this one evens
  itself out.
* Because I'm using this laptop for side projects and mostly frontend work I
  don't hit upon any limitations of WSL but there are plenty of apps or
  libraries that can cause issues when run within WSL. If you're expecting WSL
  to just work with everything I would taper your expectations slightly. That
  said, WSL2 supposedly fixes a lot of this (I saw a video where someone runs
  Docker via WSL2, which is quite cool!) so this might get better once WSL2 is
  out.

## In conclusion

I've been pleasantly surprised with my journey into Windows 10 so far and it's
gone much better than expected! With WSL2 and further improvements to the
developer workflow on Windows I'm excited to see where we are in another 6-12
months time. It's really exciting to see Microsoft shift and take this stuff
more seriously - and they are doing an excellent job!
