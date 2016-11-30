const { attributes } = require('../src');

const User = attributes({
  name: String,
  age: Number
})(class User {});

const user = new User();

exports.name = 'Updating';

exports.cases = [
  {
    name: 'without coercion',
    fn() {
      user.name = 'Something';
      user.age = 42;
    }
  },
  {
    name: 'with coercion',
    fn() {
      user.name = 1337;
      user.age = '50';
    }
  },
  {
    name: 'assign to attributes without coercion',
    fn() {
      user.attributes = {
        name: 'Something',
        age: 42
      };
    }
  },
  {
    name: 'assign to attributes with coercion',
    fn() {
      user.attributes = {
        name: 1337,
        age: '50'
      };
    }
  }
];
