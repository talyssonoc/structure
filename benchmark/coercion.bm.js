const { attributes } = require('../packages/structure/src');

const Book = attributes({
  year: Number
})(class Book { });

class FantasyBooksCollection extends Array { }
class FriendsCollection extends Array { }
class Item { }

const User = attributes({
  name: String,
  item: Item,
  favoriteBook: Book,
  books: {
    type: Array,
    itemType: Book
  },
  fantasyBooks: {
    type: FantasyBooksCollection,
    itemType: Book
  },
  friendsNames: {
    type: FriendsCollection,
    itemType: String
  }
})(class User { });

const CircularUser = require('../packages/structure/test/fixtures/CircularUser');

exports.name = 'Coercion';

exports.cases = [
  {
    name: 'Primitive coercion',
    fn() {
      new User({
        name: 50
      });
    }
  },
  {
    name: 'Nested coercion [x1]',
    fn() {
      new User({
        item: {
          name: 'foo'
        }
      });
    }
  },
  {
    name: 'Nested coercion [x2]',
    fn() {
      new User({
        favoriteBook: {
          year: 2017
        }
      });
    }
  },
  {
    name: 'Nested coercion [x3]',
    fn() {
      new User({
        favoriteBook: {
          year: '2017'
        }
      });
    }
  },
  {
    name: 'Primitive coercion with dynamic types',
    fn() {
      new CircularUser({
        name: 50
      });
    }
  },
  {
    name: 'Nested coercion with dynamic types [x1]',
    fn() {
      new CircularUser({
        favoriteBook: {
          name: 'A Study in Scarlet'
        }
      });
    }
  },
  {
    name: 'Nested coercion with dynamic types [x2]',
    fn() {
      new CircularUser({
        favoriteBook: {
          name: 1984
        }
      });
    }
  },
  {
    name: 'Nested coercion with dynamic types [x3]',
    fn() {
      new CircularUser({
        friends: [
          new CircularUser(),
          new CircularUser()
        ]
      });
    }
  },
  {
    name: 'Nested coercion with dynamic types [x4]',
    fn() {
      new CircularUser({
        friends: [
          {},
          {}
        ]
      });
    }
  },
  {
    name: 'Nested coercion with dynamic types [x5]',
    fn() {
      new CircularUser({
        friends: [
          {
            favoriteBook: {}
          },
          {
            favoriteBook: {}
          }
        ]
      });
    }
  },
  {
    name: 'Array coercion [1x]',
    fn() {
      new User({
        books: [
          { year: 1 },
          { year: 2 },
          { year: 3 }
        ]
      });
    }
  },
  {
    name: 'Array coercion [2x]',
    fn() {
      new User({
        books: [
          { year: '1' },
          { year: '2' },
          { year: '3' }
        ]
      });
    }
  },
  {
    name: 'Array subclass coercion [1x]',
    fn() {
      new User({
        friendsNames: new FriendsCollection(1, 2, 3)
      });
    }
  },
  {
    name: 'Array subclass coercion [2x]',
    fn() {
      new User({
        fantasyBooks: new FantasyBooksCollection(
          { name: 'A' },
          { name: 'B' },
          { name: 'C' }
        )
      });
    }
  },
  {
    name: 'Array subclass coercion [3x]',
    fn() {
      new User({
        fantasyBooks: new FantasyBooksCollection(
          { year: '1' },
          { year: '2' },
          { year: '3' }
        )
      });
    }
  },
  {
    name: 'Array subclass coercion [4x]',
    fn() {
      new User({
        fantasyBooks: [
          { year: '1' },
          { year: '2' },
          { year: '3' }
        ]
      });
    }
  }
];
