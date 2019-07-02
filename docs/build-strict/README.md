# Build Strict

To instantiate a structure and automatically throw an error if that is invalid, you can use the buildStrict function.

```js
const { attributes } = require('structure');
const User = attributes({
    name: {
      type: String,
      required: true
    },
    age: Number
})(class User {});

var user = User.buildStrictMode({
  age: 'Twenty'
});

// Error: Invalid Attributes
// details: [
//   { message: '"name" is required', path: 'name' },
//   { message: '"age" must be a number', path: 'age' }
// ]
```