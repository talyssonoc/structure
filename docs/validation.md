# Validation

An `validate()` method will be added to the prototype of structures, this method will validate the structure based on its schema. The method will return an object with the property `valid` (with the value `true` if it's valid, and `false` if invalid). If `valid` is `false` the returned object will also have a property `errors`, with an array of validation errors.

Validations require you to use the complete type descriptor:

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

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"name" length must be at least 10 characters long', path: 'name' },
  { message: '"age" is required', path: 'age' }
]
*/

const validUser = new User({
  name: 'This is my name',
  age: 25
});

const validation = validUser.validate();

validation.valid; // true
validation.errors; // undefined, because `valid` is true
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
})(class User {
  getFullGreet() {
    return `${this.greet} ${this.initials}`;
  }
});
```

### Number validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value
- `integer`: must be an integer (default: `false`)
- `precision`: maximum number of decimal places
- `positive`: must be positive (default: `false`)
- `negative`: must be negative (default: `false`)
- `min`: __**__ minimum valid value (works like the `>=` operator)
- `greater`: __**__ must be greater than passed value (works like the `>` operator)
- `max`: __**__ maximum valid value (works like the `<=` operator)
- `less`: __**__ must be smaller than passed value (works like the `<` operator)

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
})(class Pool {
  getVolume() {
    return this.depth * this.width * this.length;
  }
});
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
    default: () => Date.now()
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
  favoriteBook: Book,
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