# Arrays coercion

It's also possible to coerce values to `Array` or some other class that extends `Array`. On these circumstances Structure will use the `itemType` value of the attribute definition on the schema to coerce the items as well. Note that, when coercing arrays, it'll always create a new instance of the type and then push each item of the passed value to the new instance:

```javascript
class BooksCollection extends Array {}

const Library = attributes({
  books: {
    type: BooksCollection,
    itemType: String,
  },
  users: {
    type: Array,
    itemType: String,
  },
})(class Library {});

const libraryOne = new Library({
  books: ['Brave New World'],
  users: ['John', 1],
});

libraryOne.books; // BooksCollection ['Brave New World'] => coerced the array to BooksCollection
libraryOne.users; // ['John', '1'] => new instance of Array with coerced items
```

The passed raw value have to be non-null and have a `length` attribute or implement the `Symbol.iterator` method, otherwise it'll fail to coerce and throw a `TypeError`.

## Observations

Structure only does array **items** coercion during instantiation, so mutating an array \(using push, for example\) won't coerce the new item:

```javascript
const Library = attributes({
  books: {
    type: Array,
    itemType: String,
  },
})(class Library {});

const library = new Library({
  books: [1984],
});

library.books; // ['1984'] => coerced number to string

library.books.push(42);

library.books; // ['1984', 42] => new item was not coerced
```

