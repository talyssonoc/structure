# Strict mode

To instantiate a structure that automatically throws an error if that is invalid, you can use the buildStrict function.

```javascript
const { attributes } = require('structure');
const User = attributes({
    name: {
      type: String,
      required: true
    },
    age: Number
})(class User {});

var user = User.buildStrict({
  age: 'Twenty'
});

// Error: Invalid Attributes
// details: [
//   { message: '"name" is required', path: 'name' },
//   { message: '"age" must be a number', path: 'age' }
// ]
```

## Custom error

Normally `buildStrict` will throw a default `Error` when attributes are invalid but you can customize the error class that will be used passing a `strictValidationErrorClass` to the _second_ parameter of the `attributes` function.

The value of `strictValidationErrorClass` should be a class that accepts an array of erros in the constructor.

```javascript
const { attributes } = require('structure');

class InvalidBookError extends Error {
  constructor(errors) {
    super('Wait, this book is not right');
    this.code = 'INVALID_BOOK';
    this.errors = errors;
  }
}

const Book = attributes({
    name: {
      type: String,
      required: true
    },
    year: Number
}, {
  strictValidationErrorClass: InvalidBookError
})(class Book {});

var book = Book.buildStrict({
  year: 'Twenty'
});

// InvalidBookError: Wait, this book is not right
// code: 'INVALID_BOOK'
// details: [
//   { message: '"name" is required', path: 'name' },
//   { message: '"year" must be a number', path: 'year' }
// ]
```

