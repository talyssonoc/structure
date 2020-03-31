# Recursive coercion

Structure also does recursive coercion so, if your declared type is Array or other Structure, the items/attributes of the raw value will be coerced as well:

```javascript
class BooksCollection extends Array {}

const Book = attributes({
  name: String,
})(class Book {});

const User = attributes({
  favoriteBook: Book,
  books: {
    type: BooksCollection,
    itemType: Book,
  },
})(class User {});

const user = new User({
  favoriteBook: { name: 'The Silmarillion' },
  books: [{ name: '1984' }],
});

user.favoriteBook; // Book { name: 'The Silmarillion' } => coerced plain object to Book
user.books; // BooksCollection [ Book { name: '1984' } ] => coerced array to BooksCollection and plain object to Book
```

