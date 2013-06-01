---
layout: post
title: "Using objects in jQuery's .css()"
intro: "Something I will be focusing on on a regular basis here at JSP is producing tidy code that's easier to maintain in the future as well as nicer to work with. One such area where people often produce messy code is when using jQuery's .css() method."
---

Something I will be focusing on on a regular basis here at JSP is producing tidy code that's easier to maintain in the future as well as nicer to work with. One such area where people often produce messy code is when using jQuery's `.css()` method.

Basic usage of this goes like so:

    $(elem).css("display"); //returns value
    $(elem).css("display", "block"); //sets value

And in order to set multiple values, people will often do this:

    $(elem)
      .css("display", "block")
      .css("border", "1px solid blue")
      .css("background", "#F00")
      {and so on}

However this is the wrong way to do this, on so many levels. jQuery is written pretty cleverly, and `.css()` can take an object of properties & their respective values:

    $(elem).css({
      "border" : "1px solid blue",
      "display" : "block",
      "background" : "#F00"
    });

It's worth noting that you don't actually need the quotes around the properties (but you do around the values), this would be valid:

    $(elem).css({
      border: "1px solid blue",
      {so on}
    });

However, you have to use quotes if you want to use a reserved word as a property. For example if you were creating a new element & setting the class attribute:

    $("<div/>", {
    class: "myDiv"
    });

That's invalid, as `class` is a reserved word, so you'd have to do :

    $("<div/>", {
      "class" : "myDiv"
    });

Because this always trips me up, I've simply gotten into the habit of always putting quotes around my property names in JS objects. This is more a personal preference than anything else, just pick what makes the most sense to you.

    $(elem).css({
      border: "1px solid blue",
      {so on}
    });
