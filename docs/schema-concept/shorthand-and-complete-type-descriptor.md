# Shorthand type descriptor
The shorthand is a pair of `propertyName: Type` key/value like this:

```js
const User = attributes({
  name: String,
  brithday: Date
})(class User {
  generateRandomBook() {
    return '...';
  }
});
```

# Complete type descriptor
The complete descriptor allows you to declare additional info for the attribute.
__For Array types it's required to use the complete type descriptor because you must specify the `itemType`__.

```js
const User = attributes({
  name: {
    type: String,
    default: 'Anonymous'
  },
  cars: {
    type: Array,
    itemType: String,
    default: ['Golf', 'Polo']
  },
  book: {
    type: String,
    default: (instance) => instance.generateRandomBook()
  }
})(class User {
  generateRandomBook() {
    return '...';
  }
});
```

## default
The __default__ of an attribute will be used if no value was provided for the specific attribute at construction time.

You can also use a function which receives the instance as a parameter in order to provide the default. The operation must be synchronous and the function will called after all the other attributes are already assigned,
thus, you can use the other attributes of your class to compose a default value.

```js
const User = attributes({
  name: {
    type: String,
    default: 'Anonymous' // static default value
  },
  greeting: {
    type: String,
    default: (instance) => instance.greeting() // dynamic default value
  }
})(class User {
  greeting() {
    return `Hello ${this.name}`;
  }
});
```

Please note that setting the value of an attribute to undefined will not make it fallback to the default value.

## itemType
The __itemType__ of an attribute is used to validate and coerce the type of each item from the attribute, like when the attribute type is `Array` or some class that extends `Array`.

* Please refer to [Validation](../validation/README.md) in order to check a bit more on validation properties.

# Type concept
Each attribute needs a __type__ definition, that's how Structure validates and coerces the attribute's value. It can be divided into three categories (as in right now):

- Primitives (Number, String, Boolean)
- Classes (Date, Object, regular Classes and Structure classes as well)
- Array/Array-like (Array, extended Array)
