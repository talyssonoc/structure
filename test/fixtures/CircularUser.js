const { attributes } = require('../../src');

const User = attributes({
  name: String,
  friends: {
    type: Array,
    itemType: 'User'
  },
  favoriteBook: {
    type: 'Book',
    required: true
  },
  books: {
    type: 'BooksCollection',
    itemType: String
  }
}, {
  dynamics: {
    User: () => User,
    Book: () => require('./CircularBook'),
    BooksCollection: () => require('./BooksCollection')
  }
})(class User { });

module.exports = User;
