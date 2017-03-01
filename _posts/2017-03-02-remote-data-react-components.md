---
layout: post
title: Dealing with APIs in React with ReactRemoteData
intro: Today I'll talk about a new library I've written for React called ReactRemoteData, which makes working with API data in React.
githubPath: 2017-03-02-remote-data-react-components
---

Last year I wrote about [RemoteDataJS](http://javascriptplayground.com/blog/2016/06/remote-data-js/), a [library I released on GitHub](https://github.com/jackfranklin/remote-data-js) that made it really easy to deal with data from APIs in JavaScript.

This library lets you represent remote pieces of data properly, dealing with all the different states it can be in, and any errors that might occur. Since writing that library I've been doing a lot of work with React, which has fast become my framework of choice, and I've now written a React library for RemoteData.

## React Remote Data

[React Remote Data](https://github.com/jackfranklin/react-remote-data) provides a React component that will deal with loading some data and showing you the results. You tell it what to render for each possible state that your data might be in, and it does the rest.

You can install the library from npm by running `npm install react-remote-data-js`. Let's see how we can use this component, by writing a component that renders your data from the GitHub API.

You have to give the `RemoteData` five props:

- `url`, which is the URL that should be fetched. This can be a function instead, but we'll tackle that later.

The other four props all map to the states of the API request, which can be one for states:

- `notAsked` - the request has not been made yet
- `pending` - the request is in progress
- `success` - the request has succeeded
- `failure` - the request has failed

The `RemoteData` component expects a function for each of these possible states, and it will render the right component based on the right state.

First, let's define a function for the `notAsked` state. This gets called with a prop called `fetch`, which is the function called to trigger the request. Our `notAsked` function looks like so:

```js
const notAsked = props => <div><button onClick={props.fetch}>Make Request</button></div>
```

Next, we'll write a function for the `pending` state, which will simply show some loading text (you could render a spinner here, for example):

```js
const pending = () => <p>Loading...</p>
```

Next, our `success` case. When a request has succeeded the data will be provided via the `request` prop, which contains all the information about the request, including a `data` key, which has the parsed data as JSON, which we can render:

```js
const success = props => <div><p>Name: {props.request.data.login}</p></div>
```

In this case one of the properties that Github gives us is `login`, so I'll render that onto the screen.

Finally, we can deal with the failure case by logging an error. In this case, `request.data` will be the HTTP error, and we can output the `message` property:

```js
const failure = props => <div><p>Error: {props.request.data.message}</p></div>
```

And with that we now have all the properties required to create the `RemoteData` instance:

```js
import RemoteData from 'react-remote-data-js'

const GithubData = () => (
  <RemoteData url="http://api.github.com/users/jackfranklin"
    notAsked={notAsked}
    pending={pending}
    success={success}
    failure={failure}
  />
)
```

Under the hood, `RemoteData` keeps track of the request's state and ensures that the component renders the correct function depending on the state of the HTTP request.

## Thoughts on creating `ReactRemoteData` and abstracting with React

I think that this library also shows just how powerful React is and how we can use it to abstract libraries behind components. The [entire source of the library](https://github.com/jackfranklin/react-remote-data/blob/master/src/index.js) is only 55 lines long, and I've come to really enjoy using React in this way. Hiding complexity in components that are then easily reused is a great way to help developers build applications quicker and with more clarity, because you can read the components being used in the code and take an educated guess on what they do.

Another benefit of creating components like this is that it's very easy for you to create customised versions of them. Let's say you have a standard `HttpError` component, that takes an error and shows a nice message to the user. You want to add `ReactRemoteData` to your app, and you want every single instance of it to render your `HttpError` component when something goes wrong. You can simply wrap `ReactRemoteData` with your own version:

```
import HttpError from 'your/app/components'

const MyRemoteData = props => (
  <ReactRemoteData {...props} failure={props => <HttpError {...props} />} />
)

export default MyRemoteData
```

This makes it easy to deal with errors in one place, and be able to change it in just one place if your requirements change later on.

## Conclusion

If you'd like an easy library that takes all the hassle out of remote HTTP requests, then I think `ReactRemoteData` might be for you. You can find further instructions on its usage [on the GitHub repository](https://github.com/jackfranklin/react-remote-data) and I'd love to hear any of your thoughts via Twitter or as a GitHub issue.
