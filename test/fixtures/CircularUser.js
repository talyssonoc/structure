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
  }
}, {
  dynamics: {
    User: () => User,
    Book: () => require('./CircularBook')
  }
})(class User { });

module.exports = User;
