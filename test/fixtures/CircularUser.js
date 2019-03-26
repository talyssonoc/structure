const { attributes } = require('../../src');

const User = attributes({
  name: String,
  friends: {
    type: Array,
    itemType: 'User'
  },
  favoriteBook: {
    type: 'Book',
    required: true,
    nullable: true
  },
  books: {
    type: 'BooksCollection',
    itemType: String
  },
  nextBook: {
    type: 'Book'
  }
}, {
  dynamics: {
    User: () => User,
    Book: () => require('./CircularBook'),
    BooksCollection: () => require('./BooksCollection')
  }
})(class User { });

module.exports = User;
