---
layout: post
title: "Structuring React applications"
intro: "Today's post lays out my current thinking and approach to structuring React applications: the folder structure I use, my naming conventions, where I write tests, and so on."
---

One of the best features of React is that it doesn't force much convention and
leaves a lot of decisions up to the developer. This is different from say,
EmberJS or Angular, which provide more out of the box for you, including
conventions on where and how different files and components should be named.

> My personal preference is the React approach as I like the control, but there
> are many benefits to the Angular approach too. This comes down to what you and
> your team prefer to be working with.

Over the years I've been working with React I've tried many different ways of
structuring my applications. Some of these ideas turned out to be be better than
others, so in today's post I am going to share all the things that have worked
well for me and hopefully they will help you too.

> This is not written as the "one true way" to structure your apps: feel free to
> take this and change it to suit you, or to disagree and stick to what you're
> working with. Different teams building different applications will want to do
> things differently.

It's important to note that if you loaded up the
[Thread](https://www.thread.com) frontend, you would find places where all of
these rules are broken! Any "rules" in programming should be thought of as
guidelines - it's hard to create blanket rules that always make sense, and you
should have the confidence to stray from the rules if you think it's going to
improve the quality of what you're working on.

So, without further ado, here's all I have to say on structuring React
applications, in no particular order.

## Don't worry too much

This might seem like an odd point to get started on but I genuinely mean it when
I say that I think the biggest mistake people make is to stress too much about
this. This is especially true if you're starting a new project: it's impossible
to know the best structure as you create your first `index.jsx` file. As it
grows you should naturally end up with some file structure which will probably
do the job just fine, and you can tweak it as pain points start to arise.

If you find yourself reading this post and thinking "but our app doesn't do any
of these!" that's _not a problem_! Each app is different, each team is
different, and you should work together to agree on a structure and approach
that makes sense and helps you be productive. Don't worry about changing
immediately how others are doing it, or what blog posts like this say is most
effective. My tactic has always been to have my own set of rules, but read posts
on how others are doing it and crib bits from it that I think are a good idea.
This means over time you improve your own approach but without any big bang
changes or reworks 👌.

## One folder per main component

The approach I've landed on with folders and components is that components
considered to be the "main" components of our system (such as a `<Product>`
component for an e-commerce site) are placed in one folder called `components`:

```
- src/
  - components/
    - product/
      - product.jsx
      - product-price.jsx
    - navigation/
      - navigation.jsx
    - checkout-flow/
      - checkout-flow.jsx
```

Any small components that are only used by that component live within the same
directory. This approach has worked well because it adds some folder structure
but not so much that you end up with a bunch of `../../../` in your imports as
you navigate. It makes the hierarchy of components clear: any with a folder
named after them are big, large parts of the system, and any others within exist
primarily to split that large component into pieces that make it easier to
maintain and work with.

## Nested folders for sub components if you prefer

One downside of the above is that you can often end up with a large folder for
one of these big components. Take `<Product>` as an example: it will have CSS
files (more on those later), tests, many sub-components and probably other
assets like images, SVG icons, and more, all in the one folder.

I actually don't mind that, and find that as long as the file is named well and
is discoverable (mostly via the fuzzy finder in my editor), the folder structure
is less important.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🔥 Hot take: Most people create way too many folders in their projects. Introducing 5 levels of nested folder structure makes things harder to find, not easier.<br><br>&quot;Organizing&quot; things doesn&#39;t actually make your code better or make you more productive 👀</p>&mdash; Adam Wathan (@adamwathan) <a href="https://twitter.com/adamwathan/status/1145109572081860610?ref_src=twsrc%5Etfw">June 29, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you would like more structure though it's easy to simply move the
sub-components into their own respective folders:

```
- src/
  - components/
    - product/
      - product.jsx
      - ...
      - product-price/
        - product-price.jsx
```

## Tests alongside source code

Let's start the points with an easy one: keep your test files next to your
source files. I'll dive into more detail on how I like to structure all my
components so their code is next to each other, but I've found my preference on
tests is to name them identically to the source code, in the same folder, but
with a `.test` suffix:

* `auth.js`
* `auth.test.js`

The main benefits of this approach are:

* it's easy to find the test file, and easy at a glance to see if there are even
  tests for the file you're working on
* all imports that you need are easier: no navigating out of a `__tests__`
  directory to import the code you want to test. It's as easy as
  `import Auth from './auth'`.

If we ever have any test data that we use for our tests - mocking an API call,
for example - we'll put it in the same folder too. It feels very productive to
have everything you could ever need available right in the same folder and to
not have to go hunting through a large folder structure to find that file you're
sure exists but can't quite remember the name of.

## CSS Modules

I'm a big fan of [CSS Modules](https://css-tricks.com/css-modules-part-1-need/)
and we've found them great for writing modularised CSS in our components.

> I'm also a big fan of [styled-components](https://www.styled-components.com),
> but found at work with many contributors using actual CSS files has helped
> people feel comfortable working with them.

As you might have guessed, our CSS files go alongside our React components, too,
in the same folder. It's really easy to jump between the files and understand
exactly which class is doing what.

The broader point here is a running theme through this blog post: keep all your
component code close to each other. The days of having individual folders for
CSS, JS, icons, tests, are done: they made it harder to move between related
files for no apparent gain other than "organised code". Co-locate the files that
interact the most and you'll spend less time folder hopping and more time coding
👌.

## Mostly one component per file

In my experience people stick far too rigidly to the rule that each file should
have only one React component defined within it. Whilst I subscribe to the idea
that you don't want too large components in one file (just think how hard it
would be to name that file!), there's nothing wrong with pulling a small
component out if it helps keep the code clear, and remains small enough that it
makes little sense to add the overhead of extra files.

For example, if I was building a `<Product>` component, and needed a tiny bit of
logic for showing the price, I might pull that out:

```js
const Price = ({ price, currency }) => (
  <span>
    {currency}
    {formatPrice(price)}
  </span>
)

const Product = props => {
  // imagine lots of code here!
  return (
    <div>
      <Price price={props.price} currency={props.currency} />
      <div>loads more stuff...</div>
    </div>
  )
}
```

The nice thing about this is you don't create another file and you keep that
component private to `Product`. Nothing can possibly import `Price` because we
don't expose it. This means it'll be really clear to you about when to take the
step of giving `Price` its own file: when something else needs to import it!

## Truly generic components get their own folder

One step we've taken recently at work is to introduce the idea of generic
components. These will eventually form our design system (which we hope to
publish online) but for now we're starting small with components such as
`<Button>` and `<Logo>`. A component is "generic" if it's not tied to any part
of the site, but is considered a building block of our UI.

These live within their own folder (`src/components/generic`) and the idea
behind this is that it's very easy to see all of the generic components we have
in one place. Over time as we grow we'll add a styleguide (we are big fans of
[react-styleguidist](https://github.com/styleguidist/react-styleguidist)) to
make this even easier.

## Make use of import aliasing

Whilst our relatively flat structure limits the amount of `../../` jumping in
our imports, it's hard to avoid having any at all. We use the
[babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
to define some handy aliases to make this easier.

> You can also do this via Webpack, but by using a Babel plugin the same imports
> can work in our tests, too.

We set this up with a couple of aliases:

```js
{
  components: './src/components',
  '^generic/([\\w_]+)': './src/components/generic/\\1/\\1',
}
```

The first is straight forward: it allows any component to be imported by
starting the import with `components`. So rather than:

```js
import Product from '../../components/product/product'
```

We can instead do:

```js
import Product from 'components/product/product'
```

And it will find the same file. This is great for not having to worry about
folder structure.

That second alias is slightly more complex:

```js
'^generic/([\\w_]+)': './src/components/generic/\\1/\\1',
```

We're using a regular expression here to say "match any import that starts with
`generic` (the `^` ensures the import starts with "generic"), and capture what's
after `generic/` in a group. We then map that to
`./src/components/generic/\\1/\\1`, where `\\1` is what we matched in the regex
group. So this turns:

```js
import Button from 'generic/button'
```

Into:

```js
import Button from 'src/components/generic/button/button'
```

Which will find us the JSX file of the generic button component. We do this
because it makes importing these components really easy, and protects us from if
we decide to change the file structure (which we might as we grow our design
system).

> Be careful with aliases! A couple to help you with common imports are great,
> but more and it'll quickly start causing more confusion than the benefits it
> brings.

## A generic "lib" folder for utilities

I wish I could get back all the hours I spent trying to find the perfect
structure for all my non-component code. I split them up into utilities,
services, helpers, and a million more names that I can't even remember. My
approach now is much more straightforward: just put them all in one "lib"
folder.

Long term, this folder might get so large that you want to add structure, but
that's OK. _It's always easier to add extra structure than remove superfluous
structure_.

Our `lib` folder at Thread has about 100 files in it, split roughly 50/50
between tests and implementation. And it hasn't once been hard to find the file
I'm looking for. With fuzzy file finders in most editors, I can just type
`lib/name_of_thing` and I'll find exactly what I want nearly every time.

We've also added an alias to make importing easier:
`import formatPrice from 'lib/format_price'`.

Don't be afraid of flat folders with lots of files in. It's often all you need.

## Hide 3rd party libraries behind your own API so they are easily swappable

I'm a big fan of [Sentry](https://sentry.io/welcome/) and have used it many
times across the backend and the frontend to capture and get notified of
exceptions. It's a great tool that has helped us become aware of bugs on the
site very quickly.

Whenever I implement a 3rd party library I'm thinking about how I can make it
easy to replace should we need to. Often we don't need to - in the case of
Sentry we are very happy - but it's good to think about how you would move away
from one service, or swap it for another, just in case.

The best approach for this is to provide your own API around the underlying
tool. I like to create a `lib/error-reporting.js` module, which exposes an
`reportError()` function. Under the hood this uses Sentry, but other than in
`lib/error-reporting.js`, there is no direct import of the Sentry module. This
means that swapping Sentry for another tool is really easy - I change one file
in one place, and as long as I keep the public API the same, no other files need
know.

> A module's public API is all the functions it exposes, and their arguments.
> This is also known as a module's public interface.

## Always use `prop-types` (or TypeScript/Flow)

Whenever I'm programming I'm thinking about the three versions of myself:

* Past Jack, and the (questionable at times!) code he wrote
* Current Jack, and what code I'm writing right now
* Future Jack, and how I can write code now that makes his life as easy as
  possible later on

This sounds a bit silly but I've found it a useful way to frame my thinking
around approaches: _how is this going to feel in six months time when I come
back to it?_

One easy way to make current and future versions of yourself more productive is
to document the prop-types that components use! This will save you time in the
form of typos, misremembering how a certain prop is used, or just completely
forgetting that you need to pass a certain prop. The
[`eslint-react/prop-types` rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md)
comes in handy for helping remind us, too.

Going one step further: try to be specific about your prop-types. It's easy to
do this:

```js
blogPost: PropTypes.object.isRequired
```

But far more helpful if you do this:

```js
blogPost: PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  // and so on
}).isRequired
```

## Don't reach for libraries until you need them

This advice is more true now with the
[release of React hooks](/refactoring-to-react-hooks/) than it ever has been
before. I've been working on a large rebuild of part of
[Thread's site](https://www.thread.com) and decided to be extra particular about
including 3rd party libraries. My hunch was that with hooks and some of my own
utilities I could get pretty far down the road before needing to consider
anything else, and (unusually! 😃) it turned out that my hunch was correct.
[Kent has written about this in his post "Application State Management with React"](https://kentcdodds.com/blog/application-state-management-with-react)
but you can get a long way these days with some hooks and React's built in
context functionality.

## Avoid event emitters

## Make tests easy with domain specific utilities
