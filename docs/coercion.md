# Coercion

Structure does type coercion based on the declared [schema](/docs/schema-concept.md). It's important to note that it __never__ coerces the following scenarios:
 - `undefined`;
 - `null` when `nullable` option is enabled;
 - value is already of the declared type (except for arrays, we'll talk more about this soon).

Let's break the coercion into 3 categories:

### Primitive type coercion

It'll do primitive type coercion when it tries to coerce values to `String`, `Number` or `Boolean` types.

For those types we basically use the type as a function (without using `new`), with a subtle difference: When coercing `null` to `String`, it'll coerce to empty string instead of the string `'null'`. For example:

```js
const User = attributes({
  name: String,
  age: Number,
  isAdmin: Boolean
})(class User { });

const userOne = new User({
  name: 'Foo Bar',
  age: 50,
  isAdmin: true
});

userOne.name; // 'Foo Bar' => no coercion was done
userOne.age; // 50 => no coercion was done
userOne.isAdmin; // true => no coercion was done

const userTwo = new User({
  name: null,
  age: '100',
  isAdmin: undefined
});

userTwo.name; // '' => coerced `null` to empty string
userTwo.age; // 100 => coerced string to number
userTwo.isAdmin; // undefined => it'll never coerce `undefined`
```

### Arrays and Array subclasses

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

### Generic coercion

If the declared type is not a primitive nor Array (or an array subclass) it'll do generic coercion. When generic coercing a value, Structure will just instantiate the declared type (using `new`) passing the raw value as the parameter (only if the raw value isn't of the declared type already).

```javascript
class Location {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

const User = attributes({
  location: Location
})(class User { });

const userOne = new User({
  location: new Location({ x: 1, y: 2 })
});

userOne.location; // Location { x: 1, y: 2 } => no coercion was done


const userTwo = new User({
  location: { x: 3, y: 4 }
});

userTwo.location; // Location { x: 3, y: 4 } => coerced plain object to Location
```

Coercion to `Date` type enters in this same category, so if you have an attribute of the type `Date`, it'll use `new Date(<raw value>)` to coerce it. For more info about how this coercion works check the cases for `value` and `dateString` parameters on [Date documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

#### Recursive coercion

Structure also does recursive coercion so, if your declared type is Array or other Structure, the items/attributes of the raw value will be coerced as well:

```javascript
class BooksCollection extends Array { }

const Book = attributes({
  name: String
})(class Book { });

const User = attributes({
  favoriteBook: Book,
  books: {
    type: BooksCollection,
    itemType: Book
  }
})(class User { });

const user = new User({
  favoriteBook: { name: 'The Silmarillion' },
  books: [
    { name: '1984' }
  ]
});

user.favoriteBook; // Book { name: 'The Silmarillion' } => coerced plain object to Book
user.books; // BooksCollection [ Book { name: '1984' } ] => coerced array to BooksCollection and plain object to Book
```

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
