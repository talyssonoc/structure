# String validations

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
- `guid`: is a valid guid. You can pass a boolean or the [options object accepted by Joi](https://github.com/hapijs/joi/blob/v10.2.0/API.md#stringguid---aliases-uuid) (default: `false`)

```javascript
const User = attributes({
  id: {
    type: String,
    guid: true
  },
  token: {
    type: String,
    guid: {
      version: ['uuidv4']
    }
  },
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
