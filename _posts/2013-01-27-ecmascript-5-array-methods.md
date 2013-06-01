---
layout: post
title: "ECMAScript 5 Array Methods"
---

Something I've not covered much so far is some of the newer parts of JavaScript. That is, methods in ECMASscript 5 that are not so commonly used due to browser support, and of course the new features in ECMAScript 6. Today I want to take a look at the new Array methods in ES5, such as `map` and `filter`.

If you'd like to know the browser support for these methods, it's actually pretty good. [This site shows the support](http://kangax.github.com/es5-compat-table/), and for most the only blip is IE 8 and lower. And if you do need to support older browsers, [shims are available](https://github.com/kriskowal/es5-shim). Let's have a look at the Array methods introduced in ES5. This wont be an in-depth look exploring the ins and outs of every method, but more a quick summary over them. 

The first is `indexOf`. As you might suspect, it searches the array to find the index of the passed in element:

	var arr = [1, 2, 3 ,4];
	console.log(arr.indexOf(2)); // 1
	console.log(arr.indexOf(5)); // -1
	
If the element doesn't exist, `-1` is returned. Be aware that `indexOf` finds the __first__ index, if the element is in the array more than once:

	var arr = [1, 2, 3 ,4, 2];
	console.log(arr.indexOf(2)); // 1
	
There is also `lastIndexOf` that finds the last index:

	var arr = [1, 2, 3 ,4, 2];
	console.log(arr.lastIndexOf(2)); // 4
	
Next is `every`. The [mdn documentation](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every) sums it up best:

> "`every` executes the provided callback function once for each element present in the array until it finds one where callback returns a false value. If such an element is found, the `every` method immediately returns `false`. Otherwise, if callback returned a `true` value for all elements, `every` will return `true`."

Lets take a look at an example:

	var arr = [1, 2, 3, 4];
	console.log(arr.every(function(x) {
	  console.log(x);
	}));
	
	// 1
	// false
	
Here the callback function logs one, but then doesn't return a truthy value, so `every` exists and returns false. It will loop over every element if our callback function returns true:

	var arr = [1, 2, 3, 4];
	console.log(arr.every(function(x) {
	  console.log(x);
	  return true;
	}));
	
	// 1
	// 2
	// 3
	// 4
	// true

Next we have [`some`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some). `some` executes a callback function once for every element present in the array until it finds a value for which the callback returns true, at which point `some` returns `true`. If no value is found, `some` returns `false`. Here I use `some` to test if any elements in the array are even:

	var arr = [1, 2, 3 ,4];
	console.log(arr.some(function(x) {
	  return x % 2 == 0
	}));
	
	// true
	
It returns `true` because at least one element made the callback function return `true`. If none of them do, it returns `false`:

	var arr = [1, 3, 5, 7];
	console.log(arr.some(function(x) {
	  return x % 2 == 0
	}));
	
Next is `forEach`, which is very straight forward. It takes a function and calls that function for each element in the array:

	var arr = [1, 2, 3, 4];
	arr.forEach(function(x) {
	  console.log(x);
	});
	// 1
	// 2
	// 3
	// 4
	
`map` is similar to `forEach` in that in loops over all elements in the set and calls the callback function on them, however `map` will return an array which is the result of the callback function for each element. For example:

	var arr = [1, 2, 3, 4];
	var newArr = arr.map(function(x) {
	  return x * x;
	});
	console.log(newArr);
	// [1, 4, 9, 16]
	
Here I use `map` to square each number in the array, and it then returns that new array. 

We can use `filter` to trim down our arrays to elements that only match specific criteria. `filter` executes the callback function on each element, and will only add that element to the new array if the callback function returns `true`. Below I filter out any numbers that are not even:

	var arr = [1, 2, 3, 4];
	var newArr = arr.filter(function(x) {
	  return x % 2 == 0;
	});
	console.log(newArr);
	// [2, 4]
	
The callback function only returns true for the even numbers, so the array `filter` returns contains just those.

Next is the slightly more complex `reduce`.

> "Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value."

Taken from [the MDN](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/Reduce).

The callback function for `reduce` is usually used with two arguments. The first is the previous value in the array, and the second is the next value. I find I understand this best with an example, so here is how we would use `reduce` to sum all the elements in an array:

	var arr = [1, 2, 3, 4];
	console.log(arr.reduce(function(x, y) {
	  return x + y;  
	}));
	// 10

And the arguments are passed through like so:

	(0, 1), (1, 2), (3, 3), (6, 4)
	
To give us an answer of ten. The MDN article on `reduce` is very thorough, so I highly recommend giving that a read if you're slightly confused.

Finally there is `reduceRight`, which is the same as `reduce` but starts on the right hand side, not the left.

	var arr = [1, 2, 3, 4];
	console.log(arr.reduceRight(function(x, y) {
	  return x + y;  
	}));
	// 10
	
Here the arguments are processed from right to left:

	(0, 4), (4, 3), (7, 2), (9, 1)
	
I hope this article has helped, if like me you'd not taken the time to explore some of these newer features, or perhaps had mistakenly dismissed them because you didn't realise how comprehensive the browser support is (other than our old friend IE8, of course).
