const { attributes } = require('../src');

const Order = attributes({
  createdAt: Date,
  updatedAt: {
    type: Date,
    min: { attr: 'createdAt' }
  }
})(class Order { });

const User = attributes({
  name: {
    type: String,
    minLength: 3
  },
  age: {
    type: Number,
    positive: true
  },
  order: Order
})(class User {});

exports.name = 'Validation';

exports.cases = [
  {
    name: 'With simple validation and is valid',
    fn() {
      const user = new User({
        name: 'Something',
        age: 10
      });

      user.validate();
    }
  },
  {
    name: 'With simple validation and is invalid',
    fn() {
      const user = new User({
        name: 'AB',
        age: -1
      });

      user.validate();
    }
  },
  {
    name: 'With nested validation and is valid',
    fn() {
      const user = new User({
        name: 'Something',
        age: 25,
        order: new Order({
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      user.validate();
    }
  },
  {
    name: 'With nested validation and is invalid',
    fn() {
      const user = new User({
        name: 'Something',
        age: 25,
        order: new Order({
          createdAt: new Date(),
          updatedAt: new Date(0)
        })
      });

      user.validate();
    }
  }
];
