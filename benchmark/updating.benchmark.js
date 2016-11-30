const Benchmark = require('benchmark');
const { attributes } = require('../src');

const suite = new Benchmark.Suite('Updating');

const User = attributes({
  name: String,
  age: Number
})(class User {});

const user = new User();

module.exports = suite
  .add('without coercion', () => {
    user.name = 'Something';
    user.age = 42;
  })

  .add('with coercion', () => {
    user.name = 1337;
    user.age = '50';
  })

  .add('assign to attributes without coercion', () => {
    user.attributes = {
      name: 'Something',
      age: 42
    };
  })

  .add('assign to attributes with coercion', () => {
    user.attributes = {
      name: 1337,
      age: '50'
    };
  });
