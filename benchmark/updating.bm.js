const { attributes } = require('../packages/structure/src');

const Book = attributes({
  name: String
})(class Book { });

const User = attributes({
  name: String,
  age: Number,
  favoriteBook: Book
})(class User {});

exports.name = 'Updating';

exports.cases = [
  {
    name: 'Updating without coercion',
    fn() {
      const user = new User();

      user.name = 'Something';
      user.age = 42;
    }
  },
  {
    name: 'Updating with simple coercion',
    fn() {
      const user = new User();

      user.name = 1337;
      user.age = '50';
    }
  },
  {
    name: 'Updating assigning to attributes without coercion',
    fn() {
      const user = new User();

      user.attributes = {
        name: 'Something',
        age: 42
      };
    }
  },
  {
    name: 'Updating assigning to attributes with coercion',
    fn() {
      const user = new User();

      user.attributes = {
        name: 1337,
        age: '50'
      };
    }
  },
  {
    name: 'Updating with nested coercion',
    fn() {
      const user = new User();

      user.favoriteBook = { name: 'The Silmarillion' };
    }
  }
];
