const Benchmark = require('benchmark');
const { attributes } = require('../src');

const suite = new Benchmark.Suite('Nested instantiation');

const Location = attributes({
  x: Number,
  y: Number
})(class Location {});

const User = attributes({
  name: String,
  location: Location
})(class User {});


module.exports = suite
  .add('without coercion', () => {
    const user = new User({
      name: 'Something',
      location: new Location({
        x: 1,
        y: 2
      })
    });
  })

  .add('with normal coercion', () => {
    const user = new User({
      name: 'Something else',
      location: {
        x: 1,
        y: 2
      }
    });
  })

  .add('with nested coercion', () => {
    const user = new User({
      name: 'Something else',
      location: {
        x: '1',
        y: '2'
      }
    });
  });
