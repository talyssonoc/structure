# Circular references and dynamic types

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
