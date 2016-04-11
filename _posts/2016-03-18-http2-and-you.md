---
layout: post
title: HTTP/2 and You
intro: Introducing a new version of the web's network protocol and it's implications on today's web developer.
author: Adam Henson
author_twitter: adamhenson1979
author_img: "https://www.gravatar.com/avatar/0af18cf327acab3a0a5146bf0a256b09?s=420"
---

Twenty years ago (March of 1996), Internet Explorer 2.0 was "cutting edge" in its early adoption of pre-standard HTTP/1.1. In May of 2015 the HTTP/2 specification was published as [RFC 7540](http://httpwg.org/specs/rfc7540.html).

Although nearly two decades have passed since the previous release of the world wide web's protocol, there are exciting improvements that may impact the way you architect applications. Companies like Facebook, Google, and Twitter are already using HTTP/2 ([W3Techs](http://w3techs.com/technologies/details/ce-http2/all/all)). Surprised?

In this article I'm not delving too much into the history of the protocol, but we should note HTTP/2 is based on another protocol called SPDY (pronounced speedy). SPDY started in 2012 mainly by people from Google. 

## Why?

As web and/or software developers in our constantly evolving landscape, we are bombarded with new hype on a daily basis - so, why should we care about HTTP/2? The answer is simple - efficiency and performance. Web pages delivered with HTTP/2 are efficient by sparing round trips to the network. In fact, page load improvements of around 30% are typical nowadays compared to HTTP/1.1 ([Chromium Blog](http://blog.chromium.org/2013/11/making-web-faster-with-spdy-and-http2.html)). Imagine the benefits for users on a cellular data connection or with weak Wi-Fi.

## What Does This Mean for Us?

Don't worry, there's no pressure to change immediately - HTTP/2 is backwards compatible with HTTP/1.1. If you just launched a mobile website without HTTP/2 compatibility, don't freak out - there's plenty of time to remedy this mistake. If you're in the process of building a website now or will be in the future - it would be wise to consider using HTTP/2. Similar to other new and exciting technology we want to embrace - there are a couple catches. Although supported by most modern browsers, [HTTP/2 is not currently supported by most older browsers](http://caniuse.com/#feat=http2). Also, to use this version of the protocol now - a secure connection **is** necessary. There have been mixed signals on this topic, and perhaps things could change - but currently no browser supports HTTP/2 unencrypted ([HTTP/2 Frequently Asked Questions](https://http2.github.io/faq)).

## Features

The main source of speed improvement resides in HTTP/2's support of one single connection between the server and browser. It transfers data in binary versus text format, so your machine doesn't have to spend time translating information to a format it understands. Server push allows the server to send a "request promise" and an accompanying response to the client. Other features of this protocol version include the use of multiplexing (multiple messages sent and received simultaneously between server and browser), prioritization, and compression (including [header compression](http://httpwg.org/specs/rfc7541.html)).

## Server Push

Server push is one feature that could greatly impact our approach moving forward in architecting websites for HTTP/2. "When a browser requests a page, the server sends the HTML in the response, and then needs to wait for the browser to parse the HTML and issue requests for all of the embedded assets before it can start sending the JavaScript, images and CSS. Server Push allows the server to avoid this round trip of delay by “pushing” the responses it thinks the client will need into its cache." ([HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/#whats-the-benefit-of-server-push))

[http2](https://github.com/molnarg/node-http2) is a package available for Node.js I used to create a basic [HTTP/2 demo](https://github.com/adamhenson/http2-demo). With it - you can utilize the protocol with TLS on localhost. In the demo I setup an example of server push. I have a queue of files to push like so:

```javascript
const FILES = [
  {
    'headers' : {
      'content-type' : 'text/css'
    },
    'path' : '/public/css/main.css'
  },
  {
    'headers' : {
      'content-type' : 'image/jpeg'
    },
    'path' : '/public/images/nyc.jpg'
  }
];
```

And below is the request callback function that loops through the file queue, creates a stream for each, and pushes to the server response.

```javascript
function onRequest(request, response) {
  let html = require('./templates/MainTemplate').HTML;
  if(response.push) {
    FILES.forEach((file, index) => {
      let push = response.push(file.path);
      push.writeHead(200, file.headers);
      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);
      if(index === FILES.length - 1) {
        response.end(html);
      }
    });
  }
}
```

While logging (via bunyan), the output for the image push looks like the following:

```bash
19:29:19.398Z  INFO server/http: Promising push stream (e=1, s=12, method=GET, scheme=https, authority=localhost:8080, path=/public/images/nyc.jpg)
19:29:19.398Z  INFO server/http: Sending server response (e=1, s=14, status=200)
  headers: {
    "content-type": "image/jpeg",
    "date": "Sun, 06 Mar 2016 19:29:19 GMT"
  }
```

([HTTP/2 Server Push by Arnout Engelen](http://blog.xebia.com/http2-server-push)) does a great job of explaining how http2's server push works. The server is actually pushing a promise, and then it sends the accompanying response if the client doesn't stop it.

In our code we use the HTTP/2 specific response `push` method (via [http2 public API](https://github.com/molnarg/node-http2/wiki/Public-API)) to transmit a promise of a file to be served in the response.

```javascript
response.push(file.path)
```

The server makes this promise to the client (a browser in this case) of the stream we created.

```javascript
fs.createReadStream(path.join(__dirname, file.path)).pipe(push)
```

While logging info, upon page request - we can see this transaction as the first line in the output.

```bash
Promising push stream (e=1, s=12, method=GET, scheme=https, authority=localhost:8080, path=/public/images/nyc.jpg)
```

The client can [specify it does not want to receive any pushed resources](https://tools.ietf.org/html/rfc7540#section-6.5.1), or [cancel an individual push after receiving the push promise](https://tools.ietf.org/html/rfc7540#section-8.2.2)... otherwise the server sends the accompanying response.

```bash
Sending server response (e=1, s=14, status=200)
  headers: {
    "content-type": "image/jpeg",
    "date": "Sun, 06 Mar 2016 19:29:19 GMT"
  }
```

Grey areas exist in the subject of caching, and communication between client and server in the case of browser caching. In the protocol's current state, results could vary by implementation, but theoretically the browser cache should be honored. This answer from [Stack Overflow](http://stackoverflow.com/questions/29352282/do-browser-cancel-server-push-when-resource-is-in-cache) summarizes it pretty well - "When the client receives the PUSH_PROMISE, it can look at the URI, and figure out the cache status of this resource. Browsers typically use different caches for normally received resources and pushed resources. If the cache is still valid, the client may cancel the pushed stream by sending a RST_STREAM frame to the server for that stream." ([sbordet](http://stackoverflow.com/users/1215076/sbordet))

## Debugging Tools

There are many tools available in debugging performance. [This CloudFlare article](https://blog.cloudflare.com/tools-for-debugging-testing-and-using-http-2) covers the topic well. With Chrome DevTools you can see what parts of a web page are being delivered via HTTP/2 in the network tab. In the popup menu, there are more options where you can select "protocol". In this column HTTP/2 is represented as "h2".

![](https://s3-us-west-2.amazonaws.com/hensonism/code/chrome-screenshot.png)

## Conclusion

It's much to digest - I know, but ultimately not only will our websites be faster... I believe HTTP/2 will make our lives as developers more simple. Once we've established the server-side configurations and functionality support, front-end development should especially be easier. We'll be able to cut the following activities out of our regular routines:

- Concatenating CSS and JavaScript. Organizing your assets during development according to the sections of your application they are used will make much more sense, because HTTP requests are cheap on HTTP/2.
- Generating sprites. It was fun while it lasted, but we'll see you later "background-position". Similar to above, we can be liberal with HTTP requests.
- Splitting resources between hosts (sharding). Unlike HTTP/1.1, with HTTP/2 you aren't restricted to the number of open connections.

At this point most of us have a variety of module/file loaders, and concatenation tools deeply rooted in our development process. I'm curious to see the way HTTP/2 will impact the tools and frameworks we use.
