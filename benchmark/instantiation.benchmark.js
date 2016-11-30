const Benchmark = require('benchmark');
const { attributes } = require('../src');

const suite = new Benchmark.Suite('Instantiation');

const User = attributes({
  name: String,
  age: Number
})(class User {});


module.exports = suite
  .add('without coercion', () => {
    const user = new User({
      name: 'Something',
      age: 42
    });
  })

  .add('with coercion', () => {
    const user = new User({
      name: 'Something else',
      age: '50'
    });
  });
