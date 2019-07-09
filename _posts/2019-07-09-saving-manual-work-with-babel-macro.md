---
layout: post
title: "Saving manual work with babel-plugin-macros"
intro: "Today I used babel-plugin-macros for the first time to save some heavy lifting and I wanted to share my experience using it."
---

[babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) is a
project that I've followed with interest even though I'd never had a chance to
use it. Today that changed and I wanted to share my use case and my very
positive experience using it.

## What is babel-plugin-macros?

The key feature of a Babel Macro is that they run _at compile time_. Rather than
writing JavaScript that gets bundled and executed in the browser, writing
JavaScript via babel-plugin-macros lets you run code at compile time. This means
that the code is executed _on your computer when you bundle_, not by your users
when they visit your website.

Most commonly these macros will either calculate some value (one that you can
and need at compilation time, not at runtime in the browser), or generate some
other code that runs in the browser.

As an example, once configured (we'll get to that in a moment), you can use
[preval.macro](https://www.npmjs.com/package/preval.macro) to easily evaluate
some code at compile time:

```js
import preval from 'preval.macro'

const twoPlusTwo = preval`module.exports = 2 + 2`
```

This will be executed at compilation time, and the code that ships in your
bundle looks like this:

```js
const twoPlusTwo = 4
```

## But, why is this useful?

The example above is ultimately not that useful - I think we all trust browsers
to be able to add two and two at runtime. Today I came across a problem at work
that I solved with a macro which made my job much easier.

At [Thread](https://www.thread.com) we sell clothes. Part of the site allows
users to explore our entire product listing by filtering it down to what they
are after. One of the things they can filter by is "sub category": this is
specific types of clothes within a broader category. For example, for the
category "Shirts", we have sub categories of "Plain shirts", "Formal shirts",
"Denim shirts", and so on. The feature I'm working on adds an image to each of
these sub categories in the UI so that people who might not have heard of the
terminology can still recognise the category (before working in fashion I had no
idea what a "chambray" shirt was!).

One of the designers on the team sent me all the images, and there are _a lot_.
We have 50+ sub categories across all products and I had two choices for hooking
up each image to the sub category:

1. Just use an image take and hard code the path:
   ```js
   const source = `/media/images/sub-categories/${subCategory.slug}`
   ```
1. Manually create a map of `sub category slug => image URL`. This would mean
   manually moving and importing 50+ images and hooking them into data from our
   API.
1. Explore a solution that let me automatically load in the images and not have

Unsurprisingly, I picked option three, and the game was on!

## Avoiding the basic solution

Just to add a bit of colour to why I avoided what on paper is the easiest
solution:

```js
<img
  src={`/media/images/sub-categories/${subCategory.slug}}`}
  alt={subCategory.name}
/>
```

For us this approach has a major downside: we can no longer use Webpack and
ES2015 imports to manage all our assets. We have Webpack configured to take our
images and move them into the right place, and I didn't want to have to special
case one folder of images just to make using them a little bit easier.

## Setting up babel-plugin-macros

You might think that the macros need some complex setup but nope, it's as easy
as:

1. `yarn add babel-plugin-macros`
2. Add `'macros'` to your plugins list in your babel config.

And that's it 👌.

## Sub category slugs

Each sub category is an object with a few keys:

```js
{
  name: 'Denim shirts',
  slug: 'denim-shirts',
  id: 'abc123',
}
```

Thankfully I'd already discussed with our designer that we'd name the images
based on the slugs, so I knew that I had all the images mapped and ready. This
helped a lot and it's something I'd recommend when working with a designer who
is creating a bunch of assets: chat ahead of time to figure out the best format
and naming scheme for sharing the results.

## import-all.macro

The final piece of the puzzle is the
[import-all.macro package](https://github.com/kentcdodds/import-all.macro). This
lets me generate a list of imports from a folder _at compile time_. For example:

```js
import importAll from 'import-all.macro'

const a = importAll.sync('./files/*.js')
```

Gets turned into something like this _at compile time_:

```js
import * as _filesAJs from './files/a.js'
import * as _filesBJs from './files/b.js'

const a = {
  './files/a.js': _filesAJs,
  './files/b.js': _filesBJs,
}
```

This is exactly what we want! We can use `importAll` to create an object of all
the file paths and the image URLs - We have Webpack set up so that when we
import an image we get back the full path of where that image will be put during
build:

```js
import image from './image.jpg'

// image => /media/images/image.jpg
```

Once I'd figured this out, I was ready to write some code 🎉.

## Dealing with nested folders

To make the folder of images easier to work with we'd agreed to nest sub
categories under a folder of that category. This meant that I needed to do a bit
of data manipulation to get exactly what I wanted, because the file name
returned from `import-all.macro` would have that extra folder in:

```js
const images = importAll.sync('./category_images/**/*.png')

// images looks like:
{
  './category_images/shirts/denim-shirt.png': '/media/images/category_images/shirts/denim-shirt.png',
  ...
}
```

And what I wanted to end up with was a map where the key is purely the slug:

```js
// this is what we want
{
  'denim-shirt': '/media/images/category_images/shirts/denim-shirt.png',
  ...
}
```

This was a case of doing a bit of work on the object that `import-all.macro`
generates for us:

```js
import importAll from 'import-all.macro'

const allCategoryImages = importAll.sync('./category_images/**/*.png')

const imagesMap = new Map(
  Object.entries(allCategoryImages).map(([fileName, imageUrl]) => {
    // image = "./category_images/accessories/bags.png"
    // so split and pick out just the "bags.png" bit
    const subCategory = fileName.split('/')[3]

    // remove the extension and return  [key, value] pair of [slug, imageURL]
    return [subCategory.replace(/\.png/, ''), imageUrl]
  })
)

export default imagesMap
```

And with that, we're done! Now in our React component we can fetch the image
from our Map:

```js
const imageUrl = imagesMap.get(subCategory.slug)
```

As a bonus, we can also easily add some logging to alert us to if a sub category
is missing an image:

```js
if (imageUrl.has(subCategory.slug) === false) {
  logError('...')
}
```

## Conclusion

The solution that babel-plugin-macros lets us create is elegant and easy to work
with. It will also automatically deal with new images and new sub categories and
it's easy for non-engineers to update a sub category image without needing any
help from us - they can just dump the new image in the right place and
everything will update. For tasks like this in the future we will definitely be
reaching for it again and I recommend giving it a go next time you're faced with
a much of manual lifting that feels very much like it could be automated!
