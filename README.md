# <a href="https://structure.js.org/"><img src="https://raw.githubusercontent.com/talyssonoc/structure/master/structure.jpg" width="300"></a>

## A simple schema/attributes library built on top of modern JavaScript

Structure provides a simple interface which allows you to add attributes to your classes based on a schema, with validations and type coercion.

## Packages

- [Structure](packages/structure)
- [jest-structure](packages/jest-structure)

## [Documentation](https://structure.js.org/)

## Example Structure usage

For each attribute on your schema, a getter and a setter will be created into the given class. It'll also auto-assign those attributes passed to the constructor.

```js
const { attributes } = require('structure');

const User = attributes({
  name: String,
  age: {
    type: Number,
    default: 18,
  },
  birthday: Date,
})(
  class User {
    greet() {
      return `Hello ${this.name}`;
    }
  }
);

const user = new User({
  name: 'John Foo',
});

user.name; // 'John Foo'
user.greet(); // 'Hello John Foo'
```

## [Contributing](contributing.md)

## [LICENSE](license.md)
