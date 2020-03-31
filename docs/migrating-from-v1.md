# Migrating from v1 to v2

Migrating an app that uses Structure v1 to use Structure v2 requires some changes in the way validation errors are expected to be returned, default fallback of null values and upgrading Node (if you use a version lower than v10.13.0)

## Validation errors

In v1, validations used to be like this:

```js
const Book = attributes({
  name: {
    type: String,
    required: true,
  },
})(class Book {});

const User = attributes({
  initials: {
    type: String,
    minLength: 2,
  },
  favoriteBook: Book,
  books: {
    type: Array,
    itemType: Book,
  },
})(class User {});

const user = new User({
  initials: 'A',
  favoriteBook: new Book(),
  books: [new Book()],
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

Notice that the message used to contain only the name of the attribute (so if it's nested it will only show the attribute name of the nested structure) and the path is a string that use a dot `.` to represent that it's a nested attribute.

If your app relies on the content of the message or the path, you'll have to consider that it's now returned like this:

```js
const Book = attributes({
  name: {
    type: String,
    required: true,
  },
})(class Book {});

const User = attributes({
  initials: {
    type: String,
    minLength: 2,
  },
  favoriteBook: Book,
  books: {
    type: Array,
    itemType: Book,
  },
})(class User {});

const user = new User({
  initials: 'A',
  favoriteBook: new Book(),
  books: [new Book()],
});

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"initials" length must be at least 2 characters long', path: ['initials'] },
  { message: '"favoriteBook.name" is required', path: ['favoriteBook', 'name'] },
  { message: '"books[0].name" is required', path: ['books', 0, 'name'] }
]
*/
```

In v2 the message contains the whole path for the attribute (using dot `.` to represent it's a nested attribute) and the path is not an array.

So if your apps relies in the content of the message you'll probably have to do some parsing of this message now. And if it relies in the path to be a string, you can use [`path.join('.')`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join).

## Nullability and defaults

Since v2 now allows having nullable attributes, non-nullable attributes will fallback to the [default](schema-concept/shorthand-and-complete-attribute-definition.md#default) the same way it happens with attributes with `undefined` value since v1.

## New public methods

Structure v2 also adds two new instance methods to the structures: `instance.get(attrName)` and `instance.set(attrName, attrValue)`. They are **not** replacing the normal getters and setters, which are still there, they are just alternatives for the case you use a [custom setter and/or getter](custom-setters-and-getters.md)

So if any of your structures declare methods with these names you'll have to change it or it's gonna break.

## Upgrade Node

The minimum Node LTS supported by Structure is now v10.13.0 which is the lowest active [LTS](https://nodejs.org/en/about/releases/).
