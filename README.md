<img src="structure.jpg" width="300">

### A simple schema/attributes library built on top of modern JavaScript

<img src="https://img.shields.io/travis/talyssonoc/structure.svg"> <img src="https://img.shields.io/coveralls/talyssonoc/structure.svg">
---
Structure provides a simple interface which allows you to add schemas to your ES6 classes.

- [Getting started](Getting started)
- [Usage](Usage)
- [Schema Concept](Schema Concept)
- [Coercion](Coercion)
- [Validation](Validation)
- [Support](Support) 

## Getting started 

`npm install structure`

## Usage

```js
import { attributes } from 'structure';

const userSchema = {
  name: String,
  age: {
    type: Number,
    defaultValue: 18
  },
  birthday: Date
};

class UserClass {
 greet() {
  return `Hello ${this.name}`;
 }
}

const User = attributes(userAttributes)(UserClass);

/* The attributes "wraps" the Class, still providing access to its methods: */

const user = new User({
  name: 'John Foo'
});

user.greet(); // Hello John Foo
```

## Schema Concept
The schema is an object responsible to map the atrributes Structure should handle:

```js
const userSchema = {
  name: String,
  age: Number
};

attributes(userSchema)(class User {});
```

You can use the __shorthand type descriptor__ or __complete type descriptor__ individually for each attribute.

#### Shorthand type descriptor
The shorthand is a pair of `propertyName: Type` key/value like: `age: Number`.

#### Complete type descriptor
The complete descriptor allows you to declare additional info for the attribute:

```js
const userSchema = {
  name: {
   type: String,
   defaultValue: 'John Foo'
  },
  cars: {
   type: Array,
   items: String,
   defaultValue: ['Golf', 'Polo']
  },
  books: {
   type: String,
   defaultValue: (instance) => instance.generateRandomBook()
  }
};

const User {
 generateRandomBook() {
  return '...';
 }
}
```

##### defaultValue
The __defaultValue__ of a type will be used if no value was provided for the specific attribute at construction time.

You can also use a function which receives the instance as a parameter in order to provide the defaultValue. The operation must be synchronous.

Please note that removing the value of the attribute will not fallback to the defaultValue.

##### items
The __items__ of a type is used to validate each item's Type of the attribute's collection.

#### Type concept
Each attribute needs a __Type__ definition, that's how Structure validates and coerces the attribute's value. It can be divided into three categories (as in right now):

- Primitives (Number, String, Boolean)
- Classes (Date, Object, regular Classes and Structure classes as well)
- Array/Array-like (Array, extended Array)

## Coercion

Structure does type coercion based on the declared [schema](Schema). It's important to note that it __never__ coerces `undefined` and it also won't coerce if the value is already of the declared type (except for arrays, we'll talk more about this soon). Let's break the coercion into 3 categories:

### Primitive type coercion

It'll do primitive type coercion when it tries to coerce values to `String`, `Number` or `Boolean` types.

For those types we basically use the type as a function (without using `new`), with a subtle difference: When coercing `null` to `String`, it'll coerce to empty string instead of the string `'null'`. For example:

```js
const User = attributes({
  name: String,
  age: Number,
  isAdmin: Boolean
})(class User {});

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

It's also possible to coerce values to `Array` or some other class that extends `Array`. On these circumstances Structure will use the `items` value of the type descriptor on the schema to coerce the items as well. Note that, when coercing arrays, it'll always create a new instance of the type and then push each item of the passed value to the new instance:

```javascript
class BooksCollection extends Array { }

const Library = attributes({
  books: {
    type: BooksCollection,
    items: String
  },
  users: {
    type: Array,
    items: String
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

Structure also does recursive coercion, so if your declared type is Array or other structure the items/attributes of the raw value will be coerced as well:

```javascript
class BooksCollection extends Array { }

const Book = attributes({
  name: String
})(class Book { });

const User = attributes({
  favoriteBook: Book,
  books: {
    type: BooksCollection,
    items: Book
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

Remember that Structure only does coercion during object creation, so mutating an array (using push, for example) won't coerce the new item:

```javascript
const Library = attributes({
  books: {
    type: Array,
    items: String
  }
})(class Library { });

const library = new Library({
  books: [1984]
});

library.books; // ['1984'] => coerced number to string

library.books.push(42);

library.books; // ['1984', 42] => new item was not coerced

```

## Validation

An `isValid()` method will be added to the prototype of structures, this method will validate the structure based on its schema. If `isValid()` returns `false`, a property called `errors` will be added to the structure instance, an array of validation errors.

Validations require you to use the object type descriptor:

```javascript
const User = attributes({
  name: {
    type: String,
    minLength: 10
  },
  age: {
    type: Number,
    required: true
  }
})(class User { });

const user = new User({
  name: 'John'
});

user.isValid(); // false

user.errors; /*
[
  { message: '"name" length must be at least 10 characters long', path: 'name' },
  { message: '"age" is required', path: 'age' }
]
*/
```

Structure has a set of built-in validations built on top of the awesome [joi](https://www.npmjs.com/package/joi) package:

**Observations**

Validations marked with __*__ accept a value, an attribute reference, or an array of values and attribute references mixed.

Validations marked with __**__ accept a value or an attribute reference.

### String validations

- `required`: can't be undefined (default: `false`)
- `empty`: accepts empty string (default: `false`)
- `equal`: __*__ equal to passed value
- `minLength`: can't be shorter than passed value
- `maxLength`: can't be longer than passed value
- `exactLength`: length must be exactly the passed value 
- `regex`: matches the passed regex
- `alphanumeric`: composed only by alphabetical and numeric characters
- `lowerCase`: all characters must be lower cased
- `upperCase`: all characters must be upper cased
- `email`: is a valid email (default: `false`)

```javascript
const User = attributes({
  initials: {
    type: String,
    upperCase: true,
    maxLength: 4
  },
  password: String,
  passwordConfirmation: {
    type: String,
    equal: { attr: 'password' }
  },
  greet: {
    type: String,
    required: true,
    equal: ['Mr', 'Ms', 'Mrs', 'Miss', { attr: 'greetDesc' }]
  },
  greetDesc: String
})(class User { });
```

### Number validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value
- `integer`: must be an integer (default: `false`)
- `precision`: maximum number of decimal places
- `positive`: must be positive (default: `false`)
- `negative`: must be negative (default: `false`)
- `min`: __**__ minimum value
- `greater`: __**__ must be greater than passed value
- `max`: __**__ maximum value
- `less`: __**__ must be smaller than passed value

```javascript
const Pool = attributes({
  depth: {
    type: Number,
    positive: true
  },
  width: {
    type: Number,
    min: { attr: 'depth' }
  },
  length: {
    type: Number,
    greater: { attr: 'width' }
  }
})(class Pool { });
```

### Boolean validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value

```javascript
const User = attributes({
  isAdmin: {
    type: Boolean,
    required: true
  }
})(class User { });
```

### Date validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value
- `min`: __**__ must be after passed date
- `max` __**__ must be before passed date

```javascript
const Product = attributes({
  fabricationDate: {
    type: Date,
    defaultValue: () => Date.now()
  },
  expirationDate: {
    type: Date,
    min: { attr: 'fabricationDate' }
  }
})(class Product { });
```
### Array validations

- `required`: can't be undefined (default: `false`)
- `sparse`: can have undefined items (default: `true`)
- `minLength`: minimum quantity of items
- `maxLength`: maximum quantity of items
- `exactLength`: exact quantity of items

```javascript
const Group = attributes({
  members: {
    type: Array,
    items: String,
    minLength: 2
    maxLength: 5,
    sparse: false
  },
  leaders: {
    type: Array,
    items: String,
    minLength: 1
    maxLength: { attr: 'members' }
  }
})
```

### Nested validations

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
  favoriteBook: {
    type: Book
  },
  books: {
    type: Array,
    items: Book
  }
})(class User { });

const user = new User({
  initials: 'A',
  favoriteBook: new Book(),
  books: [new Book()]
});

user.isValid(); // false

user.errors; /*
[
  { message: '"initials" length must be at least 2 characters long', path: 'initials' },
  { message: '"name" is required', path: 'favoriteBook.name' },
  { message: '"name" is required', path: 'books.0.name' }
]
*/
```

## Browser Support
 

