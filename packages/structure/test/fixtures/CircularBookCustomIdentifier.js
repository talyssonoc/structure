const { attributes } = require('../../src');
const UserModule = require('./CircularUserCustomIdentifier');

const Book = attributes(
  {
    name: String,
    owner: 'UserEntity',
    nextBook: 'BookEntity',
    pages: {
      type: Number,
    },
  },
  {
    identifier: 'BookEntity',
    dynamics: {
      UserEntity: () => UserModule.User,
      BookEntity: () => Book,
    },
  }
)(class Book {});

exports.Book = Book;
