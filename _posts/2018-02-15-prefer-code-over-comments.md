---
layout: post
title: Preferring code over comments
intro: A short post on refactoring code to avoid comments that could instead be code.
githubPath: 2018-02-15-prefer-code-over-comments
---

I think we'd all agree that code comments are a good way to document code that
is otherwise hard to follow. Sometimes there's just no way to make the code as
clear as you'd like and a comment is a good solution.

That said, comments have one large issue: they can get out of date. An outdated
comment that is incorrect could cause you to lose a lot of time to debugging.
You may set out with the best intentions of keeping the code and comment in sync
but realistically over time it won't happen.

Whenever possible it's best to remove comments if you can make the code more
explicit. I came across a nice example of this recently that shows this in
action.

## The problem with comments in action

I was working with an API that would respond with a custom `code` property on
each response. This API was taking a query and returning search results, and the
`code` in the response would signify if the response was successful, or if no
results were found, or if there was an API error. I wrote a first pass at a
small JavaScript module to wrap this API and ended up with code that looked like
so:

```js
makeRequestToLibrary().then(({ code }) => {
  if (code === 2000) {
    // 2000 is the success code
    return { success: true, ... }
  } else if (code === 4040) {
    // 4040 = our request returned no results
    return { success: false ... }
  } else if (code === 4020 || code === 4021) {
    // 4020 and 4021 are API issues - invalid key, invalid request, etc
    return { success: false, ... }
  }
})
```

This works well, and is reasonably clear, but is leaving itself wide open to the
outdated comments problem. It would be very easy for a developer to add in a new
code we need to deal with and not update the comments, or the API to change its
codes, or a combination of both of them. You'd be in danger of ending up with
something that looked like this:

```js
} else if (code === 4030) {
  // 4020 and 4021 are API issues - invalid key, invalid request, etc
  return { success: false, ... }
}
```

Here the comment bears no relation to the error - is it the case that `4030` is
the new error code, or is it the case that we should handle `4020` instead of
`4030` and we made a typo with the number? It's impossible to tell.

## Removing comments for code

Instead of comments we can encode the knowledge that maps status codes to
responses such that the code becomes self documenting and we can remove the
comments whilst maintaining the clarity that we were aiming for.

To do this we can create an object that maps a response type to the code:

```js
const API_RESPONSES = {
  SUCCESS: 2000,
  NO_RESULTS: 4040,
  INVALID_KEY: 4020,
  INVALID_REQUEST: 4021,
}
```

And now update our code (for now I've left the comments in place):

```js
makeRequestToLibrary().then(({ code }) => {
  if (code === API_RESPONSES.SUCCESS) {
    // 2000 is the success code
    return { success: true, ... }
  } else if (code === API_RESPONSES.NO_RESULTS) {
    // 4040 = our request returned no results
    return { success: false ... }
  } else if (code === API_RESPONSES.INVALID_KEY || code === API_RESPONSES.INVALID_REQUEST) {
    // 4020 and 4021 are API issues - invalid key, invalid request, etc
    return { success: false, ... }
  }
})
```

Notice how now our comments are effectively duplicating what the code is telling
the reader. Any person curious to learn the code that maps to each response type
need only jump to the definition of `API_RESPONSES` and find it. We can remove
the comments and not lose any clarity:

```js
makeRequestToLibrary().then(({ code }) => {
  if (code === API_RESPONSES.SUCCESS) {
    return { success: true, ... }
  } else if (code === API_RESPONSES.NO_RESULTS) {
    return { success: false ... }
  } else if (code === API_RESPONSES.INVALID_KEY || code === API_RESPONSES.INVALID_REQUEST) {
    return { success: false, ... }
  }
})
```

## Comments aren't always bad

Please don't misunderstand me; I'm not saying that all comments are bad.
Sometimes the nature of code is that it a comment can make it much clearer.
Sometimes though a feeling of wanting to add an explanatory comment can be a
hint of a change to your code that could make things clearer and more self
documenting.

Use comments when you need to, but first take a moment to think if you can make
a code change first.
