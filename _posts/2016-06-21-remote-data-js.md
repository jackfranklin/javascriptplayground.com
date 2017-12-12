---
layout: post
title: Better data fetching with RemoteDataJS
intro: In this post I introduce a library I've created for fetching data from APIs called RemoteDataJS.
---

One of the things that most of us have to do in our applications is fetch data from a remote data source, typically an API that gives us back some JSON data. This is something that's pretty straight forward, particularly with the newer `fetch` API, and I'm willing to bet most developers would be quite happy writing the code to do this.

However, something that's less obvious is how to deal with all the different states that a piece of remote data can be in. I reckon there's four distinct states:

* Not requested: no request has yet been made
* Pending: a request has been made, but no data has been returned
* Succeeded: a request has succeeded, and we have some data back
* Failed: a request was made, it went wrong, and we have an error

Dealing with all of those states in your application is tricky, and it's also dull. No one wants to deal with the error case, and writing the logic to show a spinner when a request is pending is really dull.

Most of the time people will model their data with a flag that states if the request is loading or not, and then a `data` key that is undefined initially and is populated when the request succeeds:

```js
{
  loading: true,
  data: undefined
}

// later

{
  loading: false,
  data: { ... }
}
```

But then how do you deal with an error that you might want to keep around and store?

```js
{
  loading: false,
  data: undefined,
  error: ...
}
```

Suddenly your state has three keys on it that are all tightly related. In his post ["How Elm slays an antipattern"](http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html), Kris Jenkins describes how Elm's type system enables you to present data using one type, which he calls `RemoteData`, that encapsulates every state that a request can be in. Today I'm announcing my efforts on recreating this in JavaScript with my new library, [RemoteDataJS](https://github.com/jackfranklin/remote-data-js).

## RemoteDataJS

RemoteDataJS is a single object that encapsulates all of the logic and states involved in an HTTP request. You create it and tell it what URL it should make a request to (no request will be made until you tell it to, though):

```js
var githubPerson = new RemoteData({
  url: function(username) {
    return `https://api.github.com/users/${username}`
  },
  onChange: function(newPerson) {
    ...
  }
});
```

In addition, you define an `onChange` that will be called with a _new instance of `RemoteData`_ every time the state changes.

To make a request, you call `fetch`, passing in any arguments needed to create the URL:

```js
githubPerson.fetch('jackfranklin');
```

Your `onChange` callback will then be called twice, first as the request transitions from the starting state of `NOT_ASKED` to `PENDING`, and then again from `PENDING` to `SUCCESS` (or, potentially `FAILURE` instead).

The `fetch` call also returns a promise, and will throw if it fails:

```js
githubPerson
  .fetch('jackfranklin')
  .then(/*success!*/)
  .catch(/*fail!*/);
```

## Avoiding Mutation

Every time your `onChange` function is called, or you chain to the promise returned by `fetch`, the argument that is passed to your function is a **brand new `RemoteData` instance**. Rather than mutate the existing instance, `RemoteData` constructs a new instance of itself, copying all its callback functions and information across, but defining the new state. This means nothing gets mutated and you can avoid weird mutation bugs.

## With React

Because we avoid mutation and provide an `onChange` function for you to listen to data changing, it's easy to tie `RemoteData` in with React. First, define an instance of `RemoteData` as state:

```js
class Person extends React.Component {
  constructor() {
    super();
    this.state = {
      githubPerson: new RemoteData({
        url: username => `https://api.github.com/users/${username}`,
        onChange: githubPerson => this.setState({ githubPerson })
      })
    }
  }
  ...
}
```

Note how rather than have multiple keys on our state we can wrap all the logic up in an instance of `RemoteData`. In the `onChange` call we simply set the state to have the new remote data instance.

We can then define a `render` function that takes our `githubPerson` and returns the right response based on the state:

```js
renderGithubPerson(person) {
  if (person.isNotAsked()) return "No Request Made";
  if (person.isPending()) return "Loading data from GitHub";
  if (person.isSuccess()) return `Name: ${person.data.name}`;
  if (person.isFailure()) return "Failure";
}
```

And finally we can bind a `click` event to tell the instance to make the request:

```
click() {
  this.state.githubPerson.fetch('jackfranklin');
}
```

[You can see this example on JSBin](http://jsbin.com/yefuwapuja/1/edit?js,output).

## Using RemoteDataJS

I hope the above gives you some context and reasoning about why I think `RemoteDataJS` can clear up your data fetching logic and make it easier for you to deal with requests across all states that they can find themselves in.

If you want to start using it you can [check out the GitHub repository](https://github.com/jackfranklin/remote-data-js) to find more thorough documentation and information. RemoteDataJS is available as `remote-data-js` on npm for you to install. I'd love to hear your feedback, bug reports and anything else, so please feel free to raise an issue.
