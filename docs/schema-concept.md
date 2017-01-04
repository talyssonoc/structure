# Schema Concept
The schema is an object responsible to map the atrributes Structure should handle, it is the parameter of the `attributes` function.

```js
attributes({
  name: String,
  age: Number
})(class User { });
```

There are two ways to declare an attribute of the schema, the __shorthand type descriptor__ and __complete type descriptor__.

### Shorthand type descriptor
The shorthand is a pair of `propertyName: Type` key/value like: `age: Number`.

### Complete type descriptor
The complete descriptor allows you to declare additional info for the attribute. __For Array types it's required to use the complete type descriptor because you must specify the itemType__.

```js
const User = attributes({
  name: String, // shorthand type descriptor
  cars: { // complete type descriptor
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

### default
The __default__ of an attribute will be used if no value was provided for the specific attribute at construction time.

You can also use a function which receives the instance as a parameter in order to provide the default. The operation must be synchronous and the function will called after all the other attributes are already assigned.

Please note that removing the value of an attribute will not make it fallback to the default value.

### itemType
The __itemType__ of an attribute is used to validate and coerce the type of each item from the attribute, like when the attribute type is `Array` or some class that extends `Array`.

* Please refer to [Validation](/docs/validation.md) in order to check a bit more on validation properties.

### Type concept
Each attribute needs a __Type__ definition, that's how Structure validates and coerces the attribute's value. It can be divided into three categories (as in right now):

- Primitives (Number, String, Boolean)
- Classes (Date, Object, regular Classes and Structure classes as well)
- Array/Array-like (Array, extended Array)

