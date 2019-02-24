# Validate raw data

In addition to the _instance_ `validate()` method, Structure also adds a _static_ `validate()` to your structure classes that receives a _raw object_ or a _structure instance_ as parameter and has the same return type of the [normal validation](README.md):

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

// Using a raw object
const rawData = {
  name: 'John'
};

const { valid, errors } = User.validate(rawData);

valid; // false
errors; /*
[
  { message: '"name" length must be at least 10 characters long', path: 'name' },
  { message: '"age" is required', path: 'age' }
]
*/

// Using a structure instance
const user = new User({
  name: 'Some long name'
});

const validation = User.validate(user);

validation.valid; // false
validation.errors; /*
[
  { message: '"age" is required', path: 'age' }
]
*/
```
