# Validation

A `validate()` method will be added to the prototype of structures, this method will validate the structure based on its schema. The method will return an object with the property `valid` \(with the value `true` if it's valid, and `false` if invalid\). If `valid` is `false` the returned object will also have a property `errors`, with an array of validation errors.

Validations require you to use the complete attribute definition:

```javascript
const User = attributes({
  name: {
    type: String,
    minLength: 10,
  },
  age: {
    type: Number,
    required: true,
  },
})(class User {});

const user = new User({
  name: 'John',
});

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"name" length must be at least 10 characters long', path: ['name'] },
  { message: '"age" is required', path: ['age'] }
]
*/

const validUser = new User({
  name: 'This is my name',
  age: 25,
});

const validation = validUser.validate();

validation.valid; // true
validation.errors; // undefined, because `valid` is true
```

Structure has a set of built-in validations built on top of the awesome [joi](https://www.npmjs.com/package/@hapi/joi) package:

**Observations**

Validations marked with **\*** accept a value, an [attribute reference](attribute-reference.md), or an array of values and attribute references mixed.

Validations marked with **\*\*** accept a value or an [attribute reference](attribute-reference.md).

