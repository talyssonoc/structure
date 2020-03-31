# Attribute reference

You can reference attributes for some validations so the value of the referenced attribute will be used for the comparison:

```javascript
const User = attributes({
  name: String,
  password: String,
  passwordConfirmation: {
    type: String,
    equal: { attr: 'password' },
  },
})(class User {});

const user = new User({
  name: 'Gandalf',
  password: 'safestpasswordever',
  passwordConfirmation: 'notthatsafetho',
});

const { valid, errors } = user.validate();

valid; // false
errors; /* [
  {
    message: '"passwordConfirmation" must be one of [ref:password]',
    path: ['passwordConfirmation']
  }
]
*/
```

