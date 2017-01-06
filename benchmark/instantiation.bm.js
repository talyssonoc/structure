const { attributes } = require('../src');

const User = attributes({
  name: String,
  age: Number,
  isAdmin: Boolean
})(class User { });

const Product = attributes({
  name: String,
  manufacturer: User,
  manufacturedAt: Date,
  expiresAt: Date,
  purchasers: {
    type: Array,
    itemType: User
  }
})(class Product { });

exports.name = 'Instantiation';

exports.cases = [
  {
    name: 'Simple instantiation',
    fn() {
      new User({
        name: 'A name',
        age: 99,
        isAdmin: true
      });
    }
  },
  {
    name: 'Complex instantiation',
    fn() {
      new Product({
        name: 'A product',
        manufacturer: new User({
          name: 'A manufacturer',
          age: 30,
          isAdmin: false
        }),
        manufacturedAt: new Date(),
        expiresAt: new Date(),
        purchasers: [
          new User(),
          new User(),
          new User()
        ]
      });
    }
  }
];
