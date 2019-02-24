# Observations

__Important: Structure only does coercion during object creation, so mutating an array (using push, for example) won't coerce the new item:__

```javascript
const Library = attributes({
  books: {
    type: Array,
    itemType: String
  }
})(class Library { });

const library = new Library({
  books: [1984]
});

library.books; // ['1984'] => coerced number to string

library.books.push(42);

library.books; // ['1984', 42] => new item was not coerced

```
