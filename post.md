# JavaScript's getters & setters

## Why

For the most part, in JavaScript, what you see is what you get. A value’s a value; there are no tricks. Sometimes however, you’ll want a value that’s based on some other values: someone’s full name, for example, is a concatenation of their first and last names, and maybe some middle names. If you had a `person` object, and you wanted the users of that object to be able to set the persons full, first, last or middle names – and see that change immediately reflected in the other values – you’d conventionally it with functions:

```
person.setLastName('Smith');
person.setFirstName('Jimmy');
person.getFullName(); // Jimmy Smith
```

But this is ugly, and requires the users of your object to care that the properties are related; in a more complex example, that might not be as obvious as with names. Luckily, there’s a better way, added in ECMAScript 5 (so, like, recent-ish browsers).

Meet getters and setters.

## How

Let’s make that person object. We want to be able to set and of the first name, last name or full name, and have it update the other two automagically.

```
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
};
```

So what’s going on here?

The get and set keywords are the important bit. Following them is the property they relate to (`fullName`) and a function body that defines the behavior when the property is accessed (`person.fullName`) or modified (`person.fullName = 'Some Name'`).

## The official way: `Object.defineProperty`

Along with the inline method of declaring getters and setters, it can also be done more explicitly via `Object.defineProperty` ([MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)). This method takes three arguments. The first is the object to add the property to, the second is the name of the property, and the third is an object that describes the property (known as the property’s _descriptor_). Here’s an example:

```
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
```

The advantage here isn’t immediately apparent. Other than being able to add properties after creating the initial object, there’s no real benefit...or so you might think.

When you define a property, you can do much more than just define its setters or getters. Properties share the following (optional) keys:

- `configurable` (`false` by default): if this is true, the property will be able to be modified at a later point in time. 
- `enumerable` (`false` by default): if set to true, the property will appear when looping over the object (`for var key in obj`).

We can also define properties that don’t have explicit getters or setters:

```
Object.defineProperty(person, 'age', {
    value: 42
});
```

This will create `person.age`, and set it to the value 42. What’s important to note is that by default this property isn’t writable. Calling `person.age = 99` will __have no effect__. By doing this, you can create read-only properties on an object. Not only that, but because the `enumerable` property defaults to `false`, this property will not appear when we loop over the object’s keys.

If we wanted to make a property writable, we could set the `writable` property:

```
Object.defineProperty(person, 'age', {
    value: 42,
    writable: true
});

person.age = 99;
console.log(person.age); // 99
```

## Browser support?

Support is better than you might initially think. IE9 and above have full support for `Object.defineProperty`, along with Safari 5+, Firefox 4+, Chrome 5+ and Opera 12+. If you’re working with Node.js, there’s full support. Don’t you just love Node?!

Note to Jack: put “this article was writerised by Tom Ashworth with detractions by Flack Janklin blah blah blah”


