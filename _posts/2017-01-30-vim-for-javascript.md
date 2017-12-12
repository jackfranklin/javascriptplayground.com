---
layout: post
title: Setting up Vim for modern JavaScript Development
intro: Today I'll show you how I set up Vim for JavaScript development and show you some of the key parts of my configuration that make it a great environment to write JavaScript, integrating with today's prominent tools such as ESLint and Flow.
githubPath: 2017-02-01-vim-for-javascript
---

I've been using Vim solidly for about six years now, and do all of my editing in it. This blog post, all the open source code on GitHub, and all my code at work is written in Vim. I keep all my configuration in my [dotfiles repo on GitHub](http://github.com/jackfranklin/dotfiles) which means it's easily synced between computers, and I'm really happy with this set up.

I toy with my Vim configuration on a fairly frequent basis but I've now settled on a set of JavaScript plugins and configuration that's allowing me to be really productive, and integrate with tools like ESLint and Flow, and today I'll walk through the key parts of that workflow.

## JavaScript Syntax

The main plugin I use here is [pangloss/vim-javascript](http://github.com/pangloss/vim-javascript). There's many options for JS highlighting in Vim but I've found this to be the most reliable. This plugin also has support for Flow and its types, and you can enable that by turning it on in your vimrc:

```viml
let g:javascript_plugin_flow = 1
```

In addition I use [mxw/vim-jsx](http://github.com/mxw/vim-jsx) to add syntax support for JSX to my JavaScript files. It's important to note that this plugin expects your JSX files to have a `.jsx` extension, but often I just stick with `.js`. If you're doing the same, you'll want to add the following to your config:

```viml
let g:jsx_ext_required = 0
```

I also use [leshill/vim-json](http://github.com/leshill/vim-json) which improves the syntax highlighing for JSON files.

In terms of colour theme, I keep trying others but keep coming back to the [Spacegray theme](https://github.com/ajh17/Spacegray.vim), which I've now had for a long time and I'm very happy with it.

## Finding files and navigating

There are numerous options for fuzzy finding, but the one that I've found works best is [FZF](https://github.com/junegunn/fzf) and the corresponding [FZF.vim](http://github.com/junegunn/fzf.vim) plugin. This lets me quickly navigate through projects to find the files I'm after. Not JS specific, but definitely worth a mention.

## Snippets

I have to say that I probably don't utilise snippets as much as I should, but when I do I'm still a fan of [UltiSnips](https://github.com/SirVer/ultisnips). This doesn't come with snippets by default, and whilst you can rely on another plugin to give you snippets, I've just [got my own snippets file](https://github.com/jackfranklin/dotfiles/blob/master/vim/vim/UltiSnips/javascript.snippets).

## ESLint + Flow Integration

The two command line tools that I use most are ESLint and Flow. Both of these continually check my code as I'm working to ensure that I'm writing code that is typed correctly, or formatted correctly based on ESLint.

Until recently, integrating these with Vim was far from ideal, for two reasons:

1. Something I always do is to install command line tools locally, rather than globally. By doing this it means that I can have projects run different versions of the same tool without them colliding. When you do this, npm puts the executable in `./node_modules/.bin`. This can break editor integrations, because they expect to have the executable available, so try running `eslint`, rather than `./node_modules/.bin/eslint`, for example.

2. Up until the release of Vim 8, Vim didn't have support for async, background jobs. This meant when you saved your file, and ESLint ran, the editor would be unresponsive for a second or two, until ESLint returned. This is only a small amount of lag but it's really noticable.

Thankfully, both of these problems have been solved recently thanks to Vim 8 and the [Ale plugin](https://github.com/w0rp/ale), an asynchronous linting plugin for Vim. Upgrading to Vim 8 (if you're on a Mac, I recommend doing this via Homebrew) is easy, but unless you have the plugins, you don't really gain anything out of the box.

Ale is a linting plugin that comes out the box with support for a variety of linting tools for different filetypes and languages, and most importantly for me that includes ESLint and Flow. Once more, it even has support for using the locally installed version of a linter by default, so it's perfect for my needs. It automatically detects which linters to run and you really don't need to configure it at all.

The only change I made was to run the linters when I save the file, rather than continuously as I type, which is the default behaviour. This is just personal preference.

```viml
let g:ale_lint_on_save = 1
let g:ale_lint_on_text_changed = 0
```

## Testing

I run Vim from within a tmux session, which means I can split my terminal into two (much like split panes in any modern Terminal application), and have Vim on the one panel and a command line on the other. Usually I'll just do this and then run `npm test` on the command line, in watch mode. That way my tests are running side by side to my code.

To make navigating between Vim and Tmux windows easier, I use Chris Toomey's excellent [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator). You can read more about this set up in [this post from Thoughtbot](https://robots.thoughtbot.com/seamlessly-navigate-vim-and-tmux-splits).

## Editor Config

I also include the [EditorConfig vim plugin](https://github.com/editorconfig/editorconfig-vim) in my setup, so as I swap to any JS project that might have different space/tabs than my preference, Vim will automatically switch for me. This is particularly useful for contributing to open source projects (Webpack for example, uses tabs, whereas I use spaces). Having Vim swap for me is really handy.

## Conclusion

Everyone has a different preference with editors, and Vim in particular is hugely configurable. If you've got any suggestions or different plugins that you like to use, please let me know, and I hope this post helps you speed up your Vim and JavaScript workflow.
