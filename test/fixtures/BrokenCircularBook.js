const { attributes } = require('../../src');

const Book = attributes(
  {
    name: String,
    owner: 'User',
  },
  {
    dynamics: {},
  }
)(class Book {});

module.exports = Book;
