---
layout: post
title: "jQuery 1.7 Event Binding: .on() &amp; .off()"
---

From jQuery 1.7 new methods were added for binding events, `.on()` and `.off()` which, unsurprisingly, does the opposite of `.on()`. Amongst the community, there seems to have been a bit of confusion over these methods & in this post I want to clear this up, once & for all.

Firstly, I'm going to hit you with a rule:

**From now on, you should use `.on()` and `.off()` for all your event binding in jQuery.**

You actually will be doing this, whether you like it or not, if you're using jQuery 1.7+. If you take a look at the source for `.click()`, you can see it actually just calls `.on()`:

    function (data, fn) {
        if (fn == null) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    }

_For looking at the jQuery source I really like James Padolsey's [jQuery source viewer](http://james.padolsey.com/jquery/#v=git)_

It won't surprise you to know that all the other methods like `.bind()`, `.delegate()` and so on all internally use `.on()`.

In the most basic form, this is how we'd assign a click handler now:

    $(elem).on("click", function() {
    	console.log("clicked");
    });

The preferred way now of binding events is through _delegation_. The idea of delegating is that you delegate an event to a parent, and then every time it detects that event, it looks to see if the item clicked on is what we want, and then it triggers that event. This is perhaps easier to see in an example:

    $("table").on("click", "tr", function() {
    	console.log("tr inside table clicked");
    });

The advantage of this is that it's much easier work for the browser to bind one click event to one item, and then run a conditional every time that event fires, compared to binding a click event to every single `tr`. Essentially, with delegate, the process for the above code goes like this:

1. Bind 1 click event to `table`
2. Detected a click event on `table`
3. Was that click event on a `tr` ?
4. If so, fire the function.
5. If not, do nothing.

The final question you might be wondering is how we convert `.live()` events to `.on()` ? For those who are not familiar with `.live()`, it allowed you to bind an event to a selector and have that event still bound to elements you programmatically inserted into the page _after_ the event binding.

The solution is to use `.on()` & delegation. Taking our `$("table").on()` example from above, this would still fire click events on `tr` items, even if those `tr` items had been dynamically inserted by our code.

Events can be removed with `.off()`, for example:
$("p").off();
`.off()` is actually pretty clever in the way it works, again the [jQuery docs](http://api.jquery.com/off/) offer a good overview. Personally I only want to briefly mention it here, as I don't think it's something I've ever used in practice.

That concludes our brief look into `.on()`. From jQuery 1.7 onwards `.bind()`, `.live()` & `.delegate()` are all **deprecated** and I would encourage you to use the new APIs available to use, as `.on()` is a far superior method in my opinion.

For more, I suggest you read the [jQuery documentation for `.on()`](http://api.jquery.com/on/) as it is a very comprehensive read.
