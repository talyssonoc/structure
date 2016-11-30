const { attributes } = require('../src');

const Location = attributes({
  x: Number,
  y: Number
})(class Location {});

const User = attributes({
  name: String,
  location: Location
})(class User {});


exports.name = 'Nested instantiation';

exports.cases = [
  {
    name: 'without coercion',
    fn() {
      const user = new User({
        name: 'Something',
        location: new Location({
          x: 1,
          y: 2
        })
      });
    }
  },
  {
    name: 'with normal coercion',
    fn() {
      const user = new User({
        name: 'Something else',
        location: {
          x: 1,
          y: 2
        }
      });
    }
  },
  {
    name: 'with nested coercion',
    fn() {
      const user = new User({
        name: 'Something else',
        location: {
          x: '1',
          y: '2'
        }
      });
    }
  }
];
