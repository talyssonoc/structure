# Shorthand and complete attribute definition

## Shorthand attribute definition

The shorthand is a pair of `propertyName: Type` key/value like this:

```javascript
const User = attributes({
  name: String,
  brithday: Date,
})(
  class User {
    generateRandomBook() {
      return '...';
    }
  }
);
```

## Complete attribute definition

The complete definition allows you to declare additional info for the attribute. **For Array types it's required to use the complete attribute definition because you** _**must**_ **specify the `itemType`**.

```javascript
const User = attributes({
  name: {
    type: String,
    default: 'Anonymous',
  },
  cars: {
    type: Array,
    itemType: String,
    default: ['Golf', 'Polo'],
  },
  book: {
    type: String,
    default: (instance) => instance.generateRandomBook(),
  },
})(
  class User {
    generateRandomBook() {
      return '...';
    }
  }
);
```

### default

The **default** of an attribute will be used if no value was provided for the specific attribute at construction time.

You can also use a function which receives the instance as a parameter in order to provide the default. The operation must be synchronous and the function will called after all the other attributes are already assigned, thus, you can use the other attributes of your class to compose a default value.

```javascript
const User = attributes({
  name: {
    type: String,
    default: 'Anonymous', // static default value
  },
  greeting: {
    type: String,
    default: (instance) => instance.greeting(), // dynamic default value
  },
})(
  class User {
    greeting() {
      return `Hello ${this.name}`;
    }
  }
);
```

Please note that initializing an attribute with undefined will make it fallback to the default value while instantiating the structure, but it will not fallback when assigning the attribute after the structure is already constructed.

```javascript
const User = attributes({
  name: {
    type: String,
    default: 'Anonymous', // static default value
  },
})(class User {});

const firstUser = new User({ name: undefined });
firstUser.name; // 'Anonymous' =>  fallbacks to default value

const secondUser = new User({ name: 'Some name' });

secondUser.name = undefined;
secondUser.name; // undefined => does not fallback to default value
```

### itemType

The **itemType** of an attribute is used to validate and coerce the type of each item from the attribute, like when the attribute type is `Array` or some class that extends `Array`.

* Please refer to [Validation](../validation/) in order to check a bit more on validation properties.

## Type concept

Each attribute needs a **type** definition, that's how Structure validates and coerces the attribute's value. It can be divided into three categories \(as in right now\):

* Primitives \(Number, String, Boolean\)
* Classes \(Date, Object, regular Classes and Structure classes as well\)
* Array/Array-like \(Array, extended Array\)

