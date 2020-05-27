const { attributes } = require('../../src');
const BookModule = require('./CircularBookCustomIdentifier');

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
      BookEntity: () => BookModule.Book,
    },
  }
)(class User {});

exports.User = User;
