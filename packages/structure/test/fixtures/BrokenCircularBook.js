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

/* istanbul ignore next */
module.exports = Book;
