const { attributes } = require('../src');

const User = attributes({
  name: String,
  age: Number
})(class User {});

exports.name = 'Instantiation';

exports.cases = [
  {
    name: 'without coercion',
    fn() {
      const user = new User({
        name: 'Something',
        age: 42
      });
    }
  },
  {
    name: 'with coercion',
    fn() {
      const user = new User({
        name: 'Something else',
        age: '50'
      });
    }
  }
];
