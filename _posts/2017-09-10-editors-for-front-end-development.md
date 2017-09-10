---
layout: post
title: Moving away from Vim for front-end development
intro: Recently I've been considering a move away from Vim for front end development.
githubPath: 2017-09-10-editors-for-frontend-development
---

I've been a Vim user now consistently for about 6 years. My extensive [dotfiles][dotfiles] repository and (now badly outdated) blog on [TIL Vim][tilvim] demonstrate pretty well that I've spent a lot of time using, learning and tweaking my Vim set up to be exactly how I'd like.

However, as I've moved more and more into almost exclusively front-end development I've been starting to be tempted by other developers. The simple reason why is that the front-end community isn't as active on Vim as it is on other editors such as VS Code and Atom. There are fewer developers in front-end using Vim, and therefore sometimes the plugins and eco-system around it aren't quite as plentiful as other editors. To that end, I've decided to spend some time trying out other editors to see how I get on.

I tried VSCode a couple of months ago and didn't find it quite how I wanted - although I'm willing to give it another go - so for now I've picked [Atom][atom] to trial for a few weeks. If you're an Atom user, I'd love to hear from you with any recommended settings, plugins and so on. Here's the ones I've picked up so far:

- I will never not edit text without Vim keybindings, so [vim-mode-plus][vim-mode-plus] was the first plugin I installed. So far it seems very solid - I haven't found anything I can't do yet.

- I've also set up [sync-settings](https://atom.io/packages/sync-settings) so I can keep everything synced across my work and personal computer. I wish I could do this directly via my dotfiles repo (I may well be able to) but for now this is a low friction way to get it set up.

- [language-babel](https://atom.io/packages/language-babel) seems like a no brainer - it improves and adds syntax highlighting for a bunch of languages, including Flow and a bunch of JSX features.

- [git plus](https://atom.io/packages/git-plus) looks like it will make it much easier to do all my `git`ing from within Atom - complemented by [split-diff](https://atom.io/packages/split-diff) to easily see file changes.

There's many more that I've installed, including the obvious ones like plugins for linting code with Prettier, Flow and ESLint.

I've also managed to completely hide scrollbars from this [handy tip on Coderwall](https://coderwall.com/p/h_zpfa/hide-scrollbars-in-atom), and have applied this CSS to remove all the linting output from the gutters (I prefer a more narrow gutter and the linting tools also mostly underline the suspect code anyway):

```css
.gutter[gutter-name="linter-ui-default"] {
  display: none;
}
```

The main challenge for me is getting used to not having the terminal so accessible to me - normally I run Vim within a terminal so I can easily run commands in the background. However, most of the time I just run `yarn run dev` and leave it, so I think I just need to adjust to this over time.

I'll try to blog again in a few weeks once I've had more time to explore Atom and learn its quirks, but in the mean time if you have any recommendations please do let me know!

[dotfiles]: https://github.com/javascript-playground/styled-components-screencast
[tilvim]: https://github.com/styled-components/styled-components
[atom]: https://atom.io/
[vim-mode-plus]: https://github.com/t9md/atom-vim-mode-plus
