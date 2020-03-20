# <a href="https://structure.js.org/v/structure-2/"><img src="https://raw.githubusercontent.com/talyssonoc/structure/master/structure.jpg" width="300"></a>

## A simple schema/attributes library built on top of modern JavaScript

## [![npm](https://img.shields.io/npm/v/structure.svg?style=flat)](https://www.npmjs.com/package/structure) [![Build Status](https://travis-ci.org/talyssonoc/structure.svg?branch=master)](https://travis-ci.org/talyssonoc/structure) [![Coverage Status](https://coveralls.io/repos/github/talyssonoc/structure/badge.svg?branch=master)](https://coveralls.io/github/talyssonoc/structure?branch=master) [![Code Climate](https://codeclimate.com/github/talyssonoc/structure/badges/gpa.svg)](https://codeclimate.com/github/talyssonoc/structure) [![JS.ORG](https://img.shields.io/badge/js.org-structure-ffb400.svg?style=flat)](https://js.org/)

Structure provides a simple interface which allows you to add attributes to your ES6 classes based on a schema, with validations and type coercion.

## Use cases

You can use Structure for a lot of different cases, including:

- Domain entities and value objects
- Model business rules
- Validation and coercion of request data
- Map pure objects and JSON to your application classes
- Add attributes to classes that you can't change the class hierarchy

What Structure is **not**:

- It's not a database abstraction
- It's not a Model of a MVC framework
- It's not an attempt to simulate classic inheritance in JavaScript

## Usage

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

/* The attributes "wraps" the Class, still providing access to its methods: */

const user = new User({
  name: 'John Foo',
});

user.name; // 'John Foo'
user.greet(); // 'Hello John Foo'
```

## BattleCry generators

There are configurable [BattleCry](https://github.com/pedsmoreira/battlecry) generators ready to be downloaded and help scaffolding schema:

```sh
npm install -g battlecry
cry download generator talyssonoc/structure
cry g schema user name age:int:required cars:string[] favoriteBook:book friends:user[]:default :updateAge
```

Run `cry --help` to check more info about the generators available;

## [Contributing](../../contributing.md)

## [LICENSE](../../license.md)
