# Arrays coercion

It's also possible to coerce values to `Array` or some other class that extends `Array`. On these circumstances Structure will use the `itemType` value of the type descriptor on the schema to coerce the items as well. Note that, when coercing arrays, it'll always create a new instance of the type and then push each item of the passed value to the new instance:

```javascript
class BooksCollection extends Array { }

const Library = attributes({
  books: {
    type: BooksCollection,
    itemType: String
  },
  users: {
    type: Array,
    itemType: String
  }
})(class Library { });

const libraryOne = new Library({
  books: ['Brave New World'],
  users: ['John', 'Jane']
});

libraryOne.books; // BooksCollection ['Brave New World'] => coerced the array to BooksCollection
libraryOne.users; // ['John', 'Jane'] => new instance of Array
```

The passed raw value have to be non-null and have a `length` attribute or implement the `Symbol.iterator` method, otherwise it'll fail to coerce and throw a `TypeError`.

