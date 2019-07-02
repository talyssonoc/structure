const { attributes } = require('../../src');

const Book = attributes({
  name: String,
  owner: 'User',
  nextBook: 'Book',
  pages: {
    type: Number
  }
}, {
  dynamics: {
    User: () => require('./CircularUser'),
    Book: () => Book
  }
})(class Book { });

module.exports = Book;
