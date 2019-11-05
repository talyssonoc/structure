# Circular references and dynamic types

Sometimes we may need to have a type reference itself in its attributes, or have two types that reference eachother in separate files, it can be a complication because it's not possible to do this using the type definitions like we did before. For cases like this we can use a feature called "dynamic types".

When using dynamic types you can pass a string instead of the type itself in the type definition, this string will contain the type **identifier**, and then pass an object as the _second_ parameter of the `attributes` function with a key `dynamics` where the concrete type for each identifier is declared:

```javascript
/*
 * User.js
 */
const User = attributes(
  {
    name: String,
    friends: {
      type: Array,
      itemType: 'User', // << dynamic type with inferred identifier
    },
    favoriteBook: {
      type: 'BookStructure', // << dynamic type with custom identifier
      required: true,
    },
    books: {
      type: 'BooksCollection', // << dynamic type with inferred identifier
      itemType: String,
    },
  },
  {
    dynamics: {
      /* dynamic types */
      User: () => User,
      BookStructure: () => require('./Book'),
      BooksCollection: () => require('./BooksCollection'),
    },
  }
)(class User {});

/*
 * Book.js
 */
const Book = attributes(
  {
    name: String,
    owner: 'User', // << dynamic type with inferred identifier
    nextBook: 'BookStructure', // << dynamic type with custom identifier
  },
  {
    identifier: 'BookStructure', // << custom identifier
    dynamics: {
      /* dynamic types */
      User: () => require('./User'),
      BookStructure: () => Book,
    },
  }
)(class Book {});
```

## Dynamic type identifier

The type's identifier has to be same everywhere it's used, and can be defined in two ways:

### Inferred identifier

The identifier can be inferred based in the class that is wrapped by the `attributes` function. In backend scenarios this will be the most common case:

```js
const User = attributes(
  {
    name: String,
    bestFriend: 'User', // [A] type with inferred identifier
  },
  {
    dynamics: {
      User: () => User, // [B] inferred identifier concrete type
    },
  }
)(
  class User {
    //   ^ the name of this class is the identifier
    // so if we change this name to UserEntity, we'll have to change
    // both [A] and [B] to use the string 'UserEntity' instead of 'User'
  }
);
```

### Custom identifier

If for some reason you can't rely on the class name, be it because you're using a compiler that strips class names or creates a dynamic one, you can explicitly set an indentifier.

To do that, in the second argument of the `attributes` function (e.g. the options) you should add a `identifier` key and set it to be the string with the type's identifier and then use that custom value everywhere this type is dynamically needed:

```js
const User = attributes(
  {
    name: String,
    bestFriend: 'UserEntity', // << type with custom identifier
  },
  {
    identifier: 'UserEntity', // << custom identifier
    dynamics: {
      UserEntity: () => User, // << custom identifier concrete type
    },
  }
)(class User {});
```

### Concrete type definition inside `dynamics`

For the cases where the dynamic type is in a different file, it's important to call the `require` **inside** the function that returns the dynamic type, **not** in the top level of your file:

```js
const Book = attributes(
  {
    name: String,
    owner: 'User',
    nextBook: 'BookStructure',
  },
  {
    identifier: 'BookStructure',
    dynamics: {
      User: () => require('./User'), // << like this
      BookStructure: () => Book,
    },
  }
)(class Book {});
```
