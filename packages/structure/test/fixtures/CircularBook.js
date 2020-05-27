const { attributes } = require('../../src');
const UserModule = require('./CircularUser');

const Book = attributes(
  {
    name: String,
    owner: 'User',
    nextBook: 'Book',
    pages: {
      type: Number,
    },
  },
  {
    dynamics: {
      User: () => UserModule.User,
      Book: () => Book,
    },
  }
)(class Book {});

exports.Book = Book;
