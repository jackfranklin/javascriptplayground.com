---
layout: post
title: JavaScript Getters and Setters
intro: Learn how to use getters and setters to clean up your JavaScript objects.
---

For the most part, in JavaScript, what you see is what you get. A value's a value; there are no tricks. Sometimes however, you want a value that's based on some other values: someone's full name, for example, is a concatenation of their first and last names. If you have a `person` object, and you want the users of that object to be able to set the full, first or last name, and see that change immediately reflected in the other values, you'd conventionally build it with functions:

    person.setLastName('Smith');
    person.setFirstName('Jimmy');
    person.getFullName(); // Jimmy Smith

But this is ugly, and requires the users of your object to care that the properties are related; in a more complex example, that might not be as obvious as with names. Luckily, there's a better way, added in ECMAScript 5.

Meet getters and setters.

### How

Let's make that person object. We want to be able to set the first name, last name or full name, and have it update the other two automagically.

    var person = {
        firstName: 'Jimmy',
        lastName: 'Smith',
        get fullName() {
            return this.firstName + ' ' + this.lastName;
        },
        set fullName (name) {
            var words = name.toString().split(' ');
            this.firstName = words[0] || '';
            this.lastName = words[1] || '';
        }
    }

    person.fullName = 'Jack Franklin';
    console.log(person.firstName); // Jack
    console.log(person.lastName) // Franklin

So what's going on here?

The get and set keywords are important. Following them is the property they relate to (`fullName`) and a function body that defines the behaviour when the property is accessed (`name = person.fullName`) or modified (`person.fullName = 'Some Name'`).

These two keywords define accessor functions: a getter and a setter for the `fullName` property. When the property is accessed, the return value from the getter is used. When a value is set, the setter is called and passed the value that was set. It's up to you what you do with that value, but what is returned from the setter is the value that was passed in – so you don't need to return anything.

### The official way: `Object.defineProperty`

Along with the inline method of declaring getters and setters, it can also be done more explicitly via `Object.defineProperty` ([MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)). This method takes three arguments. The first is the object to add the property to, the second is the name of the property, and the third is an object that describes the property (known as the property's _descriptor_). Here's an example that replicates the above example:

    var person = {
        firstName: 'Jimmy',
        lastName: 'Smith'
    };

    Object.defineProperty(person, 'fullName', {
        get: function() {
            return firstName + ' ' + lastName;
        },
        set: function(name) {
            var words = name.split(' ');
            this.firstName = words[0] || '';
            this.lastName = words[1] || '';
        }
    });

The advantage here isn't immediately apparent. Other than being able to add properties after creating the initial object, is there a real benefit?

When you define a property this way, you can do much more than just define a setter or getter. You may also pass following keys:

- `configurable` (`false` by default): if this is true, the property's configuration will be modifiable in future. 
- `enumerable` (`false` by default): if true, the property will appear when looping over the object (`for (var key in obj)`).

We can also define properties that don't have explicit getters or setters:

    Object.defineProperty(person, 'age', {
        value: 42
    });

This will create `person.age`, and set it to the value 42. It's important to note that this property isn't writable. Calling `person.age = 99` will __have no effect__. In this way you can create read-only properties. If a property has a `value` key set, it __cannot__ have a getter or setter. Properties can have values or accessors, not both.

Not only that, but because the `enumerable` property defaults to `false`, this property will not appear when we loop over the object's keys.

If we wanted to make a property writable, we would need to set the `writable` property:

    Object.defineProperty(person, 'age', {
        value: 42,
        writable: true
    });

Now, `person.age = 99;` will have the desired effect.

### Overuse

Remember: just because a feature exists, it doesn't need to be used all the time. Getters and Setters have their use cases, but don't go over the top, or you'll most likely end up with a design that's confusing for those interacting with your objects. Used carefully, they're very powerful. But with great power comes great responsibility.

### Browser support?

IE9 and above have full support for `Object.defineProperty`, along with Safari 5+, Firefox 4+, Chrome 5+ and Opera 12+. If you’re working with Node.js, there's full support. Don't you just love Node?!

This article was co-authored with [Tom Ashworth](http://twitter.com/phuunet). Thanks to Tom for all his help putting this together.



