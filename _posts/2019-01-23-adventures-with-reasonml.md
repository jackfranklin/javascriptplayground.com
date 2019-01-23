---
layout: post
title: "Adventures with ReasonML"
intro: Over Christmas, I tackled an Advent of Code in ReasomML and in this post I'll share my solution along with my experience of Reason and its ecosystem.
githubPath: 2019-01-23-adventures-with-reasonml
---

If you follow me on Twitter, or have read this blog for a while, you'll probably
know that I'm a big fan of [Elm](https://elm-lang.org/). It's a functional,
strictly typed language that compiles to JavaScript and is a great alternative
to JavaScript for building web applications.

That said, it's not the only contender in this space.
[Reason](https://reasonml.github.io/) is also a very popular option that has
gained a lot of traction recently. I've always been interested in trying it out,
and [Advent of Code](https://adventofcode.com/), a series of coding challenges
posted each day leading up to Christmas, gave me a great excuse.

> If you're into Elm, you might also be interested to know that I've done two
> videos completing Advent of Code challenges in Elm that you can find
> [on Youtube](https://www.youtube.com/watch?v=pF8gSF5QlP8).

If you're eager to skip ahead into the code, you can
[find it all on GitHub](https://github.com/jackfranklin/advent-of-code-2018/tree/master/day-two-reason-ml).
In the rest of this post I'll talk you through my approach to getting up and
running with Reason, and my thoughts on the language after trying it. I am _not_
a Reason expert, so if you spot any errors or things I've misunderstood, please
let me know! Equally, there might be better ways of solving the task, so if you
have any suggestions please get in touch.

The first part of this blog post talks through my approach and how I solved the
problem, and then we end with a list of my good and bad parts of trying Reason.

## Getting started

I followed the official
[Installation and getting started](https://reasonml.github.io/docs/en/installation)
guide to get easily up and running. It involved installing the compiler,
[BuckleScript](https://bucklescript.github.io/), which is what takes Reason and
produces JavaScript.

That let me run:

```
bsb -init my-new-project -theme basic-reason
```

To get a basic project up and running! I also installed
[reason-vscode](https://marketplace.visualstudio.com/items?itemName=jaredly.reason-vscode)
so that I had nice error highlighting and type hinting as I coded. I find this
particularly useful when working with a new language/framework that I'm not
super familiar with.

## Writing tests

I didn't want to build a UI to solve the Advent of Code problem; so I did a bit
of googling to see if I could use Reason to write some unit tests, and solve the
problem in a TDD style. I managed to find
[bs-jest](https://github.com/glennsl/bs-jest), a library that adds bindings to
BuckleScript to the JS testing framework Jest. This lets us write Reason, but
have it compiled into JavaScript that we can then run with Jest as normal. So
we'll write a `tests.re` file, have it compiled into `tests.js`, and then run
`jest tests.js`. Setting this up was just a case of following the instructions
in the README, and it worked perfectly.

## The Advent of Code challenge

I was taking on [Day Two](https://adventofcode.com/2018/day/2), and for this
exercise only completed Part One. I'll leave Part Two as an exercise for you!

The first part of the exercise needed me to take a string, such as `bababc`, and
calculate the frequencies that letters occur. So for this string, we'd end up
with:

```
{ a: 2, b: 3, c: 1 }
```

So that was the first thing I set out to write. I discovered that BuckleScript
provides a
[`Js.Dict`](https://bucklescript.github.io/bucklescript/api/Js.Dict.html) module
that is the equivalent of a native JS object, and I could use that. It also
provides
[`Js.Array`](https://bucklescript.github.io/bucklescript/api/Js.Array.html), and
[`Js.String`](https://bucklescript.github.io/bucklescript/api/Js.String.html).
Using a combination of methods from these modules, I could split my input, and
loop over it, updating a dict with new frequencies as I go through each letter.

I decided to store the frequencies in a dictionary. In Reason you have to decide
what the types of the values are in a dictionary, so I went with integers, given
we're counting frequencies.

I first set out to write a function that could take a dictionary and a letter,
and update the frequency for that letter:

* If the letter has no entry in the dictionary, create one and set the frequency
  to one.
* If the letter has a frequency, update the count by one.

Defining this function looks very similar to JavaScript:

```reason
let incrementOrSetFrequency =
  (frequencies: Js.Dict.t(int), letter: string): Js.Dict.t(int) => {
};
```

The bit that Reason adds is the type annotations. After each of the two
arguments, we declare the types. We don't have to do this - Reason will be able
to infer them for us - but I find it helps me work with code if I've documented
the type, and very rarely the compiler can infer a type slightly differently to
what you actually want it to be.

The type annotation above says that `frequencies` is a `Js.Dict.t(int)`, which
means a dictionary where each value is an `int` type. `letter` is a `string`.
After the arguments we have the return type, which is also a dict, as we want to
take the dict, update it, and then return it again.

The first thing we need to do is check to see if `letter` is in the dictionary,
and we can use `Js.Dict.get(frequencies, letter)` to do this. It doesn't return
the value or `undefined` though, like you would expect in JavaScript. Instead,
it returns something that's an `Option` type. This is Reason's way of trying to
avoid unexpected `undefined` or `null`s in your application. You can read more
about
[`Option` on the Reason docs](https://reasonml.github.io/docs/en/null-undefined-option).

When you have a function that returns an `Option` type, you can use
[pattern matching](https://reasonml.github.io/docs/en/pattern-matching) to see
what the value is, and act accordingly. So if we look in our dictionary for our
letter and it returns `None`, we need to add the letter. If it returns
`Some(int)`, we want to increment it by one:

```re
let incrementOrSetFrequency =
    (frequencies: Js.Dict.t(int), letter: string): Js.Dict.t(int) => {
  switch (Js.Dict.get(frequencies, letter)) {
  | Some(x) =>
    Js.Dict.set(frequencies, letter, x + 1);
    frequencies;
  | None =>
    Js.Dict.set(frequencies, letter, 1);
    frequencies;
  };
};
```

## Getting our first test passing

At this point I decided I'd figured out enough Reason to be dangerous, and
wanted to write a test so I could work towards getting it passing. I created
`__tests__/daytwo_test.re`:

```re
open Jest;
describe("DayTwo", () => {
  open Expect;
  test("letterFrequencies", () =>
    expect(DayTwo.letterFrequencies("bababc"))
    |> toEqual(Js.Dict.fromList([("b", 3), ("a", 2), ("c", 1)]))
  );
```

If you've written JS tests with Jest, you'll probably find the above quite
intuitive, and I was able to use `Js.Dict.fromList` to take a list of tuples and
create the dictionary that I needed for the test. The compiler compiled this
into a JS file that I could run using the regular Jest CLI. This was one thing I
liked about Reason; I can use the regular Jest CLI, rather than having to use a
special one specifically for Reason. Jest's CLI is so good that it makes total
sense to work on top of it rather than creating a language specific one from
scratch.

To get the test passing we needed to take our input string, split it into a list
of letters, and run each one through our `incrementOrSetFrequency` function:

```re
let letterFrequencies = (input: string): Js.Dict.t(int) => {
  let frequencies = Js.Dict.empty();
  input
  |> Js.String.split("")
  |> Js.Array.reduce(
       (acc, currentValue) => incrementOrSetFrequency(acc, currentValue),
       frequencies,
     );
};
```

And with that the test is passing!

## Getting frequencies for our entire puzzle input

Next we need to take our full puzzle input, which is a series of strings, and
run the above function on each of them, so we can start to work towards the
final answer that we need.

Once again, I start by writing a test. I replicate the input that the real
puzzle provides by putting each entry on its own line. I want to make sure we
get the logic for splitting lines works properly.

Note that `{|string here|}` allows us to define a multi-line string.

```
test("checksum", () => {
   let puzzleInput = {|
     abcdef
     bababc
     abbcde
     abcccd
     aabcdd
     abcdee
     ababab
   |};

   expect(DayTwo.checksum(puzzleInput)) |> toEqual(12);
});
```

We can use the familiar `Js.String.split` once again here, but pass it `"\n"` as
the thing to split on. We then map the resulting lines over `String.trim`, which
trims any whitespace and removes it. Note that we're _not_ using
`Js.String.trim` here, this is the
[ReasonML module `String`](https://reasonml.github.io/api/String.html), _not_
the
[BuckleScript `Js.String` module](https://reasonml.github.io/api/String.html).
This was one of the things I found most confusing when learning Reason. It
wasn't clear why some of the functions we use are Reason modules, and others are
provided by BuckleScript.

> If you're familiar with Reason and can clarify the above confusion, I'd love
> to talk it through and update the blog post to include it.

So, the first part of the `checksum` function is to take the multi-line input,
split it, and then ensure that we don't have any blanks:

```re
let checksum = (input: string): int => {
  input
  |> Js.String.split("\n")
  |> Js.Array.map(String.trim)
  |> Js.Array.filter(s => String.length(s) > 0)
  // note: this is invalid (we're not returning an int)
```

Once I've split the lines and given them a trim, I then use `Js.Array.filter` to
remove any strings that are entirely empty. Now we are working with an array of
letter frequencies that looks something like this:

```
[
  "abcdef",
  "bababc",
  "abbcde",
  "abcccd",
  "aabcdd",
  "abcdee",
  "ababab",
]
```

So we want to take each one and pass it into the `letterFrequencies` function
that we have defined:

```re
let checksum = (input: string): int => {
  input
  |> Js.String.split("\n")
  |> Js.Array.map(String.trim)
  |> Js.Array.filter(s => String.length(s) > 0)
  |> Js.Array.map(letterFrequencies)
  // note: this is invalid (we're not returning an int)
```

Now we've turned that list of strings into a list of frequencies. This code
sample highlights one of my favourite Reason features (I'm biased as it's also a
favourite feature of mine from other functional languages like Elm and Elixir),
the pipeline operator. The pipeline operator takes the thing on the left and
passes it as the last argument to the function on the right. It means fewer
parentheses around everything and lends itself to creating really readable code.

## Calculating frequency occurrences

Now we have a list of frequency dictionaries, we need to take them and figure
out:

* how many of them contain a letter exactly 3 times
* how many of them contain a letter exactly 2 times

The result for each of those is what we'll need to multiply together to get our
checksum, which is the solution to our puzzle.

What I'd like to do is take our list of frequencies and map it into a list of
Reason objects that contain two properties, `twice` and `thrice`. These will be
booleans and correspond to if a word contains a letter twice or thrice. To help
the compiler give me good type errors if I make a mistake, I create a custom
type:

```re
type twiceAndThriceFrequency = {
  twice: bool,
  thrice: bool,
};
```

This declares a type, `twiceAndThriceFrequency`, which is an object with two
properties that are both booleans. I can then create a function that will take a
frequencies dictionary and convert it into one of these objects. Now I have this
custom type, I can use it in the type annotation too:

```re
let findTwicesAndThrices = (frequencies: Js.Dict.t(int)): twiceAndThriceFrequency => {
  {twice: true, thrice: true }
};
```

For now I've hardcoded the values to both be `true`, we will fill those in
shortly. Notice how having the custom type defined makes the type annotation
read really nicely and clearly.

To figure out the value of the `twice` and `thrice` keys, we need to see if the
frequencies dictionary has any values of `2` or `3` in it. For this problem, we
don't actually care about _which_ letter occurs two or three times, we just need
to know if any of them do.

We can use `Js.Dict.values`, which takes a dictionary and returns an array of
the values inside it. It's just like `Object.values()` in JavaScript. We can
then use `Js.Array.some`, which takes an array and a function and tells us if
any items in the array satisfy it. Therefore, we can define the functions
`hasTwices` and `hasThrices` like so:

```re
let hasTwices = (frequencies: Js.Dict.t(int)): bool => {
  frequencies |> Js.Dict.values |> Js.Array.some(v => v === 2);
};

let hasThrices = (frequencies: Js.Dict.t(int)): bool => {
  frequencies |> Js.Dict.values |> Js.Array.some(v => v === 3);
};
```

> Note that in this solution I'm not worrying about performance. If I was, we'd
> be doing this differently to reduce the number of times we iterate over the
> `frequencies` array. I'll leave it as an exercise to the reader to improve
> that.

## Mapping to our `twiceAndThriceFrequency` type

Now we have these functions, we can define a function that will take a
frequencies dictionary and return a `twiceAndThriceFrequency` type:

```re
let findTwicesAndThrices = (frequencies: Js.Dict.t(int)): twiceAndThriceFrequency => {
  {twice: hasTwices(frequencies), thrice: hasThrices(frequencies)};
};
```

> Notice that we don't need the `return` keyword in Reason. The last expression
> in a function is automatically returned for you.

And once we have this function, we can update our main `checksum` function:

```re
let checksum = (input: string): int => {
  input
  |> Js.String.split("\n")
  |> Js.Array.map(String.trim)
  |> Js.Array.filter(s => String.length(s) > 0)
  |> Js.Array.map(letterFrequencies)
  |> Js.Array.map(findTwicesAndThrices)
  // note: this is invalid (we're not returning an int)
```

## Calculating our checksum

At this point we are working with a list of objects that have
`{ twice: true/false, thrice: true/false }` within them. We want to go through
this list and reduce it down to two values: the number of times that we have a
letter occurring twice, and the number of times we have a letter occurring three
times. So if we have this list:

```
[
  { twice: true, thrice: false },
  { twice: false, thrice: false },
  { twice: true, thrice: true },
]
```

We want to end up with:

```
{ twice: 2, thrice: 1 }
```

It's then these two numbers that we multiply to find our checksum.

We can use `Js.Array.reduce` to do this. It will take our array and loop through
each value in turn, allowing us to check the values of `twice` and `thrice` and
increment our accumulator accordingly. Our starting accumulator will be an
object, which I also define a type for:

```re
type twiceAndThriceCounter = {
  twice: int,
  thrice: int,
};
```

And now we can start planning our `reduce` call:

```re
|> Js.Array.reduce(
  (acc: twiceAndThriceCounter, currentValue: twiceAndThriceFrequency) => acc
  {twice: 0, thrice: 0},
)
```

Inside the body of the callback function, we need to check the `currentValue`
and check the values of `twice` and `thrice`.

This is a case where Reason's
[pattern matching](https://reasonml.github.io/docs/en/pattern-matching) comes in
really handy. We can write code that pattern matches against the object and its
values:

```re
switch (currentValue) {
  | {twice: true, thrice: true} => {
      twice: acc.twice + 1,
      thrice: acc.thrice + 1,
    }
  | {twice: true, thrice: false} => {
      twice: acc.twice + 1,
      thrice: acc.thrice,
    }
  | {twice: false, thrice: true} => {
      twice: acc.twice,
      thrice: acc.thrice + 1,
    }
  | {twice: false, thrice: false} => acc
},
```

Each case that we're matching against starts with the pipe (`|`) and then we
match against the `twice` and `thrice` values within `currentValue`. So the
first will match only if `currentValue` has both values set to true, in which
case we increment both of our counters. In the case of one of `twice` or
`thrice` being true, we increment the appropriate counter and if both values are
`false`, we do nothing.

Pattern matching is my favourite feature of Reason (it's also one of my
favourite parts of Elm), and it leads to some really nice, expressive code.
What's also nice is that if we don't write code that deals with every possible
case, we get a compiler error. In the example below, I've removed the case that
deals with both values being `true`. You can see the compiler spot this and tell
me:

```re
  Warning number 8
  /Users/jackfranklin/git/advent-of-code/day-two-reason-ml/src/DayTwo.re 55:10-65:10

  53 ┆ |> Js.Array.reduce(
  54 ┆      (acc: twiceAndThriceCounter, currentValue: twiceAndThriceFrequenc
       y) =>
  55 ┆        switch (currentValue) {
  56 ┆        | {twice: true, thrice: false} => {
   . ┆ ...
  64 ┆        | {twice: false, thrice: false} => acc
  65 ┆        },
  66 ┆      {twice: 0, thrice: 0},
  67 ┆    )

  You forgot to handle a possible value here, for example:
{twice=true; thrice=true}
```

This means you can never end up with code in production that doesn't deal with
all possible cases, which is fantastic. It also means if you refactor and now
your pattern matching is out of date, the compiler will tell you.

Once we have this reduce done, it's going to end up turning our array of
frequencies into one object with two values. The solution to the puzzle (and
what we need to get our test passing) is to take these values and multiply them.
We can do this by piping our object into an anonymous function that does just
this:

```re
|> result => result.twice * result.thrice
```

And with this, our tests are back to green!

```
 PASS  __tests__/daytwo_test.bs.js
  DayTwo
    ✓ letterFrequencies (6ms)
    ✓ checksum (1ms)
```

There's one small refactor we can make here though. Much like JavaScript and its
ES2015 destructuring, we can destructure an object into the keys when it's
passed into a function. So we can rewrite our final line as:

```re
|> (({twice, thrice}) => twice * thrice)
```

Which I think reads a bit more clearly. And with that, our puzzle is solved!

## Conclusion

This was literally the first time I'd written Reason and after finishing the
Advent of Code challenge I took a moment to think through what I found good, and
what I struggled with, from the perspective of a beginner using a new language.

It's also worth noting that my experience with Elm almost certainly makes it
easier for me to learn Reason, there are similarities between the two.

## Things I liked

* The tight interopability between Reason and JavaScript is very compelling. I
  could easily see myself writing one module in Reason in an existing JS
  application because the interop is so smooth and easy.
* Continuing from the previous point, the fact that Reason can use Jest for its
  test runner is excellent. Not having to learn how to run another test runner
  was a major bonus. It also helps that Jest is absolutely exceptional and packs
  in a tonne of useful features, so it makes perfect sense that Reason would
  lean on that rather than build out a brand new test runner.
* On the whole I found compiler errors clear and obvious. One of my main gripes
  with TypeScript is that some of the compiler messages were hard to parse, but
  Reason gave me understandable messages that I really appreciated, particularly
  as a beginner.
* The documentation on the Reason site is excellent. Take
  [this page on pattern matching](https://reasonml.github.io/docs/en/pattern-matching)
  as an example: it's clear, the code samples are easy to follow, and it
  explains things thoroughly. It also avoids any complex jargon and doesn't
  attempt to sound super clever.
* This one is editor specific, but the
  [reason-vscode](https://marketplace.visualstudio.com/items?itemName=jaredly.reason-vscode)
  plugin gives a really good developer experience. It was easy to quickly get
  formatting, syntax highlighting, compiler errors and so on in my editor. (If
  you use another editor, there are
  [links to plugins on the Reason site](https://reasonml.github.io/docs/en/editor-plugins)).
* Reason includes `refmt`, a code formatter for Reason code. Much like Prettier
  for JavaScript, this runs and formats your code. What's great about this is
  that all Reason projects use this, so all Reason code is formatted the same,
  and that as a beginner any worries about conventions or how to format
  something are gone. I just run the formatter! The VSCode plugin runs this for
  me when I save, so I just didn't have to think about it.

## Things I found confusing

> Please remember that I am writing this as a Reason beginner, not an authority!
> If I've misunderstood something or made a mistake, please let me know and I'd
> be happy to update the blog post and give credit accordingly.

* I've struggled in my head to fully understand the iteraction between Reason,
  OCaml and BuckleScript. In my head Reason is a syntax on top of OCaml, and
  BuckleScript is the compiler that can produce JavaScript. I'm not sure if my
  mental model stacks up though, and I found it hard to get clarity on this
  online.
* I also found it confusing where to look for documentation for available
  modules. For example, when wanting to split a string, I found the
  [Str](https://reasonml.github.io/api/Str.html) Reason module. However, this
  isn't available when compiling with BuckleScript, so I ended up using the docs
  from the BuckleScript API for
  [Js.String](https://bucklescript.github.io/bucklescript/api/Js.String.html).
  After this I was confused as to which one I should use, and why some modules
  exist in BuckleScript, but others in Reason. This is still a big point of
  confusion for me - if you can help me understand it I'd love to chat and also
  update this blog post!
* I think this is me being strongly biased based on my Elm experience, but I
  didn't love that methods like
  [Array.get](https://reasonml.github.io/api/Array.html) may raise an exception
  if the item at the given index isn't present. I think here I'm projecting my
  expectations from Elm onto Reason, and actually the approach Reason has taken
  probably is an easier entry point for JS programmers, but I'd rather they all
  return the `Option` type, which
  [Reason does support and use](https://reasonml.github.io/docs/en/null-undefined-option)

All in all, I'd really recommend giving Reason a go! I'm excited to see where
the language and ecosystem goes in 2019 and beyond, and I'll definitely be
playing with it some more, maybe next time on an actual frontend project, rather
than just a coding exercise.
