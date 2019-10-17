const { attributes } = require('../packages/structure/src');

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

const CircularUser = require('../packages/structure/test/fixtures/CircularUser');
const CircularBook = require('../packages/structure/test/fixtures/CircularBook');

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
  },
  {
    name: 'Simple instantiation with dynamic types',
    fn() {
      new CircularUser({
        name: 'A name'
      });
    }
  },
  {
    name: 'Complex instantiation with dynamic types [x1]',
    fn() {
      new CircularUser({
        name: 'A name',
        favoriteBook: new CircularBook({
          name: 'A book'
        })
      });
    }
  },
  {
    name: 'Complex instantiation with dynamic types [x2]',
    fn() {
      new CircularUser({
        name: 'A name',
        friends: [
          new CircularUser({
            name: 'A friend'
          }),
          new CircularUser({
            name: 'Another friend'
          })
        ],
        favoriteBook: new CircularBook({
          name: 'A book'
        })
      });
    }
  }
];
