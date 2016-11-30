const Benchmark = require('benchmark');
const { attributes } = require('../src');

const suite = new Benchmark.Suite('Validation');

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


module.exports = suite
  .add('when is valid', () => {
    const user = new User({
      name: 'Something',
      age: 10
    });

    user.isValid();
  })

  .add('when is invalid', () => {
    const user = new User({
      name: 'AB',
      age: -1
    });

    user.isValid();
  });
