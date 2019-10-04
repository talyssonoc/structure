const { attributes } = require('./src');
const { SCHEMA } = require('./src/symbols');

const User = attributes({
  name: String,
  age: {
    type: Number,
    required: true,
  },
})(class User {});

// console.log(User[SCHEMA]);
console.log(new User({ name: 'Name' }));
