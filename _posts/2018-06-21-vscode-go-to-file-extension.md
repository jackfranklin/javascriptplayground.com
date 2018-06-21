---
layout: post
title: Introducing VSCode GoToFile
intro: Introducing a plugin I've built to enable quicker jumping of files in VSCode.
githubPath: 2018-06-21-vscode-go-to-file-extension
---

As mentioned in [my last post on VSCode](/vscode-go-to-definition-jsx/), I've
recently been trialling it as my editor of choice and so far have found the
experience to be excellent. Coupled with the
[amVim plugin](https://github.com/aioutecism/amVim-for-VSCode), it's really
suited me well.

> I know many people use [VSCodeVim](https://github.com/VSCodeVim/Vim), but I
> was never able to get it running as smoothly as amVim.

One of the features that amVim doesn't provide is `gf`, which in Vim means "go
to file". If your cursor was over a string, and you hit `gf` on the keyboard,
Vim would try to go to that file.

## Existing Plugins

I started searching for a plugin that might do this, and came across
[seito-openfile](https://github.com/fr43nk/seito-openfile), which worked for
most of my cases, but I really wanted one that I could customise more to work
for me. In particular we use a lot of aliases on our large codebase at work, and
I wanted to build a plugin that could support them.

I couldn't quite find one that did exactly what I wanted, so I decided to bite
the bullet and build one!

## Presenting vscode-go-to-file

[VSCode GoToFile](https://github.com/jackfranklin/vscode-go-to-file) is my
attempt at recreating Vim's `gf` functionality in VSCode. It will also parse
aliases from your `jsconfig.json`, and is clever enough to try a few common
extensions if the file path doesn't have one (`.js`, `.jsx`, `.css` and
`.scss`). Working on this plugin also enabled me to experience plugin
development for the first time and I've been really impressed, VSCode offers a
great
[API that is really well documented](https://code.visualstudio.com/docs/extensionAPI/vscode-api)
and a
[great tutorial for getting started](https://code.visualstudio.com/docs/extensions/overview).

## Reporting issues

If you'd like to give this plugin a try, I'd be grateful for any feedback you
may have. I'm sure there are many improvements to be made and I'd love you to
[open an issue](https://github.com/jackfranklin/vscode-go-to-file/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)
if you find a problem.
