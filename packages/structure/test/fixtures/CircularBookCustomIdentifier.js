const { attributes } = require('../../src');

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
      UserEntity: () => require('./CircularUserCustomIdentifier'),
      BookEntity: () => Book,
    },
  }
)(class Book {});

module.exports = Book;
