---
layout: post
title: Reading and updating query params with URLSearchParams
intro: In this post we will look at the URLSearchParams API which makes it really easy to read, delete and set query parameters.
githubPath: 2018-07-23-url-search-params
---

One of the most common tasks in building a frontend application is to update
query parameters. A quick search for
[query string on npm](https://www.npmjs.com/search?q=query%20string) reveals
many options that people have built for tackling this task. But what fewer
people seem to be aware of is that there is now an API for working with query
parameters baked right into the browser and it's called
[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).
In this post we'll have a quick play with the API to see how easy it makes
working with query params.

## Browser Support

At the time of writing,
[browser support for `URLSearchParams`](https://caniuse.com/#feat=urlsearchparams)
is very good. IE11 is the main offender, along with Opera Mini. The good news is
that there is an
[excellent polyfill](https://github.com/WebReflection/url-search-params) that
you can use to ensure your application will continue to work in browsers that
don't support it natively 👍.

## Using `URLSearchParams`

`URLSearchParams` expects to be given a string of query parameters (with or
without the initial `?`). If you've got a full URL that you'd like to parse
query params from, you can use `location.search` to pull those out:

```js
// Working with the current URL
// URL: buy-shirts-here.com/filter?size=M&colour=red&sleeves=short
location.search //=> ?size=M&colour=red&sleeves=short

// Creating an instance of new URL from scratch works too...
const url = new URL("https://buy-shirts-here.com/filter?filter?size=M&colour=red&sleeves=short")
url.search //=> ?size=M&colour=red&sleeves=short
```

We can now that that `location.search` and pass it to the `URLSearchParams`
constructor:

```js
const params = new URLSearchParams(location.search)
```

### Querying for parameters

We can use `has` to see if a particular query param is present:

```js
params.has('size') // => true
params.has('button-style') // => false
```

If you want to read the values out of a query parameter, you can use `get`. If
no query parameter exists, you'll get `null` back.

```js
params.get('size') // => 'M'
params.get('button-style') // => null
```

I often find rather than use `has` to check, and then `get` to fetch the value,
I can just use `get` and check that the value is not `null`.

### `get` vs `getAll`

There's one gotcha with `get` that you need to be aware of. One of the
behaviours of query parameters is that they can have multiple values:

```js
// URL: buy-shirts-here.com/filter?size=M&size=L
```

This is a perfectly valid URL. When we pass that into `URLSearchParams`, it will
understand that `size` has multiple values. This is where the behaviour of `get`
is important: `get` will _only return the first value for the query parameter_.
If you want all of them, you need to use `getAll` which always returns an array:

```js
// URL: buy-shirts-here.com/filter?size=M&size=L
const params = new URLSearchParams(location.search)
params.get('size') //=> 'M'
params.getAll('size') //=> ['M', 'L']
```

### Iterating on parameters

You can iterate through all the parameters in a few different ways. The first if
using `for of`. Once again, be wary of parameters will multiple values, they
will appear twice!

```js
// URL: buy-shirts-here.com/filter?size=M&size=L&colour=red
const params = new URLSearchParams(location.search)
for (let p of params) {
  console.log(p)
}
// => ['size', 'M']
// => ['size', 'L']
// => ['colour', 'red']
```

You can also use `.keys()` to get an iterator of all the keys in the params, or
`.values()` to get all the values:

```js
// URL: buy-shirts-here.com/filter?size=M&size=L&colour=red
const params = new URLSearchParams(location.search)
console.log([...params.keys()]) // => ['size', 'size', 'colour']
console.log([...params.values()]) // => ['M', 'L', 'red']
console.log([...params.entries()]) // => [['size', 'M'], ['size', 'L'], ['colour', 'red']]
```

### Modifying parameters

The first thing to note is that all these methods mutate the existing
`URLSearchParams` object, rather than return a new one.

You can use `.delete()` to delete a query parameter. Note that this deletes all
values of it, if it has multiple:

```js
// URL: buy-shirts-here.com/filter?size=M&size=L&colour=red
const params = new URLSearchParams(location.search)
params.delete('size')
console.log([...params.keys()]) // => ['colour']
```

We can use `.append()` to add a new key/value pair. If the value already exists,
`append` will append the new one on, as its name suggests:

```js
// URL: buy-shirts-here.com/filter?size=M&colour=red
const params = new URLSearchParams(location.search)
params.append('size', 'L')
console.log([...params.keys()]) // => ['size', 'size', 'colour']
console.log([...params.values()]) // => ['M', 'L', 'red']
console.log([...params.entries()]) // => [['size', 'M'], ['size', 'L'], ['colour', 'red']]
```

If you want to set a new value for the parameter and remove all other existing
values, you can use `.set` to do just that:

```js
// URL: buy-shirts-here.com/filter?size=M&colour=red
const params = new URLSearchParams(location.search)
params.set('size', 'L')
console.log([...params.keys()]) // => ['size', 'colour']
console.log([...params.values()]) // => ['L', 'red']
console.log([...params.entries()]) // => [['size', 'L'], ['colour', 'red']]
```

### Getting the URL back out

After you've done all this reading and updating of query parameters, you'll
probably want to pull it back out as a URL so you can update the URL in the
browser. To do this, just call `.toString()`:

```js
// URL: buy-shirts-here.com/filter?size=M&colour=red
const params = new URLSearchParams(location.search)
params.set('size', 'L')
params.delete('colour')
console.log(params.toString()) // => 'size=L'
```

Note that `toString` does not add the `?` at the beginning, so make sure you
remember to add that if you need it.

## Conclusion

`URLSearchParams` is a great API that you can use to clearly update your query
parameters without having to worry about any additional libraries to parse query
params, or to convert them back into a string at the end. I highly recommend
using it next time you need to do some query parameter parsing or updating, and
with it being very well supported in most browsers alongside many polyfills
being available, I don't see a good reason to not use it in your next project!
