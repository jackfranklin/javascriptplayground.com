---
layout: post
title: Moving the JS Playground from GitHub Pages to Netlify
intro: A short post on why and how I've moved the JS Playground from GitHub Pages to Netlify.
githubPath: 2018-01-08-moving-to-netlify
---

Over the weekend I moved this blog from GitHub Pages to Netlify and in this blog
post I want to talk about why.

## Github Pages and the JavaScript Playground

Ever since the first blog post on this site in April 2012 I've used GitHub Pages
to host the site and it's served me well. The site is a pretty standard
[Jekyll website](https://jekyllrb.com) and as such I've never needed more power
than GitHub provided.

In the future that may not be the case. I have some big plans for this blog this
year (firstly a video series on testing React) and I was beginning to feel that
GitHub Pages was limiting me; you are able to depend on a small subset of Jekyll
plugins and that you couldn't configure redirects, extra headers or any of your
server's behaviour.

Couple the above frustrations with the fact that
[Phil Hawksworth](https://twitter.com/philhawksworth), who I've been lucky
enough to share a stage with at a conference, joined
[Netlify](https://www.netlify.com), and I felt that the time was right to try
something different.

Netlify takes the idea of publishing static code but wraps it in a powerful
application that supports continuous deployment, redirect, headers control, and
much more out of the box. Even better, you pay for more features, rather than
per users on your site, and so the free plan is more than enough for this site.

_(There is a soft limit of 100GB per month on the free accounts; but as this is
a text based blog, that's not going to be an issue.)_

## Moving to Netlify

If you want to follow along fully, you can see the
[changes I made on GitHub](https://github.com/jackfranklin/javascriptplayground.com/pull/89).

Moving to Netlify involved the following steps:

1. Update the blog's `Gemfile` to remove the `github-pages` gem in favour of
   `jekyll` directly.

2. Sign up / in with Netlify and configure it to build this repository. Netlify
   lets you specify the build command (in this case, `jekyll build`) and the
   folder to deploy (`_site`).

3. Tell Netlify which branches to deploy. You can have it deploy lots of
   branches but I told Netlify to track the `master` branch for now.

And with that, I had Netlify deploying the blog!

## Updating the custom domain

As part of the free Netlify package you are also able to add custom domains. The
process of moving the domain to being hosted by Netlify was straight forward:

1. Disable Cloudflare on the domain. I used this for SSL, but Netlify provides
   that out of the box too (via [Let's Encrypt](https://letsencrypt.org/)). In
   hindsight I should have done this last because it meant for a while there
   were security warnings on the site.

2. Use Netlify's admin panel to create a DNS zone for the domain, which allows
   Netlify to fully control the domain.

3. Netlify then provides the new nameservers, which I was able to login to my
   domain provider and update.

And that's about it! Bar the time spent waiting for DNS propagation, that was me
done.

## Simplifying URLs and Netlify redirects

I also took some extra steps as I decided to simplify down the URL structure of
the blog. Rather than the URL for posts being:

```
/blog/2018/01/moving-to-netlify
```

I wanted to instead change it to:

```
/moving-to-netlify
```

Making this change on the Jekyll site was easy; I updated my `_config.yml` to
include `permalink: /:title/`.

If I left it like this and deployed, any links on the web to any of my previous
blog posts would break, which isn't ideal for users. Netlify offers the ability
to [configure redirects](https://www.netlify.com/docs/redirects/) to prevent
this from happening.

To do this I created a `_redirects` file and put the following line into it:

```
/blog/:year/:month/:title  /:title
```

This will set up an HTTP 301 redirect from any URL that matches
`/blog/:year/:month/:title` to `/:title`. By using the `:title` syntax Netlify
matches the text and can generate the right URL to redirect the user to.

Whilst I hope to not have to be changing my URLs on a regular basis having the
ability to do so with Netlify is fantastic.

## The future of JS Playground

Moving to a platform that gives more control will enable much more on this site,
and along with some of the upcoming video and written content, I'm hopeful that
it will be a great year for this blog.
