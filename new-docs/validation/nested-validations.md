# Nested validations

Structure will validate nested values, including array items validations and nested structures.

```javascript
const Book = attributes({
  name: {
    type: String,
    required: true
  }
})(class Book { });

const User = attributes({
  initials: {
    type: String,
    minLength: 2
  },
  favoriteBook: Book,
  books: {
    type: Array,
    itemType: Book
  }
})(class User { });

const user = new User({
  initials: 'A',
  favoriteBook: new Book(),
  books: [new Book()]
});

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"initials" length must be at least 2 characters long', path: 'initials' },
  { message: '"name" is required', path: 'favoriteBook.name' },
  { message: '"name" is required', path: 'books.0.name' }
]
*/
```
