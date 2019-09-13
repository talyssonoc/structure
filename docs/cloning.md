# Cloning an instance

Structure adds a method `#clone` in order to be able to create a **shallow** copy of an instance. This methods accepts an optional overwrite object that permits you to overwrite some attributes of the copy.

```js
const { attributes } = require('structure');

const User = attributes({
  name: String,
})(class User {});

const user = new User({
  name: 'Me',
});

const cloneUserWithNoOverwrite = user.clone(); // User { name: 'Me }

const cloneWithOverwrite = user.clone({ name: 'Myself' }); // User { name: 'Myself' }
```

If the structure has a nested structure inside of it, the `#clone` method **will not** clone it but just point the new instance to the old value of the nested attribute.

```js
const { attributes } = require('structure');

const Book = attributes({
  name: String,
})(class Book {});

const User = attributes({
  name: String,
  favoriteBook: Book,
})(class User {});

const user = new User({
  name: 'Me',
  favoriteBook: new Book({ name: 'The Silmarillion' }),
});

const cloneUserWithNoOverwrite = user.clone();
cloneUserWithNoOverwrite.favoriteBook === user.favoriteBook; // true, it was not cloned

const cloneWithOverwrite = user.clone({
  favoriteBook: { name: 'The Lord of the Rings' },
});
cloneWithOverwrite.favoriteBook === user.favoriteBook; // false, it was **replaced** with the new value
cloneWithOverwrite.favoriteBook; // Book { name: 'The Lord of the Rings' }
```

## Strict mode

When cloning an instance, you can clone it in [strict mode](strict-mode.md) as well, so if the resulting clone is invalid it throws an error. To do that, pass a second argument to the `#clone` method with the option `strict` as `true`.

```js
const { attributes } = require('structure');

const User = attributes({
  name: {
    type: String,
    required: true,
  },
  age: Number,
})(class User {});

const user = new User({
  name: 'Me',
});

const clonedUser = user.clone(
  { name: null },
  { strict: true } // strict mode option
);

// Error: Invalid Attributes
// details: [
//   { message: '"name" is required', path: 'name' }
// ]
```
