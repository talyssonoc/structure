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

### Circular references and dynamic types

Sometimes we may need to have a type reference itself in its attributes, or have two types that reference eachother in separate files, it can be a complication because it's not possible to do this using the type definitions like we did before. For cases like this we can use a feature called "dynamic types".

When using dynamic types you can pass a string instead of the type itself in the type definition, and pass an object as the _second_ parameter of the `attributes` function with an object with a key called `dynamics`. This key will have functions named after the dynamic attribute types, that will be called when the given type is used, like this:


```javascript
/*
 * User.js
*/
const User = attributes({
  name: String,
  friends: {
    type: Array,
    itemType: 'User' // << dynamic type name
  },
  favoriteBook: {
    type: 'Book', // << dynamic type name
    required: true
  },
  books: {
    type: 'BooksCollection', // << dynamic type name
    itemType: String
  }
}, {
  dynamics: { // << dynamic types values
    User: () => User,
    Book: () => require('./Book'),
    BooksCollection: () => require('./BooksCollection')
  }
})(class User { });

/*
 * Book.js
*/
const Book = attributes({
  name: String,
  owner: 'User', // << dynamic type name
  nextBook: 'Book' // << dynamic type name
}, {
  dynamics: { // << dynamic types values
    User: () => require('./User'),
    Book: () => Book
  }
})(class Book { });
```

Notice that the _name_ of the type has to be the same name of the key inside the `dynamics` object. Also, it's important that the require be done __inside__ the function when the dynamic type also references the current type (in the example above, the type `User` has an attribute of the type `Book`, and the type `Book` has an attribute of the type `User`).
