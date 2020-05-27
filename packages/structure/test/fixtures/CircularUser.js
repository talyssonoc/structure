const { attributes } = require('../../src');
const BookModule = require('./CircularBook');
const BooksCollection = require('./BooksCollection');

const User = attributes(
  {
    name: String,
    friends: {
      type: Array,
      itemType: 'User',
    },
    favoriteBook: {
      type: 'Book',
      required: true,
      nullable: true,
    },
    books: {
      type: 'BooksCollection',
      itemType: String,
    },
    nextBook: {
      type: 'Book',
    },
  },
  {
    dynamics: {
      User: () => User,
      Book: () => BookModule.Book,
      BooksCollection: () => BooksCollection,
    },
  }
)(class User {});

exports.User = User;
