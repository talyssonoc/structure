const { attributes } = require('../../src');

const User = attributes(
  {
    name: String,
    friends: {
      type: Array,
      itemType: 'UserEntity',
    },
    favoriteBook: {
      type: 'BookEntity',
      required: true,
      nullable: true,
    },
  },
  {
    identifier: 'UserEntity',
    dynamics: {
      UserEntity: () => User,
      BookEntity: () => require('./CircularBookCustomIdentifier'),
    },
  }
)(class User {});

module.exports = User;
