const { attributes } = require('../src');

const User = attributes({
  name: {
    type: String,
    minLength: 3
  },
  age: {
    type: Number,
    positive: true
  }
})(class User {});

exports.name = 'Validation';

exports.cases = [
  {
    name: 'when is valid',
    fn() {
      const user = new User({
        name: 'Something',
        age: 10
      });

      user.validate();
    }
  },
  {
    name: 'when is invalid',
    fn() {
      const user = new User({
        name: 'AB',
        age: -1
      });

      user.validate();
    }
  }
];
