# Strict mode

To instantiate a structure that automatically throws an error if that is invalid, you can use the buildStrict function.

```js
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