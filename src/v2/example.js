const { attributes } = require('./src');
// const { SCHEMA } = require('./src/symbols');

const User = attributes({
  name: String,
  age: {
    type: Number,
    required: true,
  },
})(class User {});

const user = new User({ name: 'Name', age: 2 });
console.log(user.name, user.age, user.attributes);
