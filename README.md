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

Structure was inspired by Ruby's [Virtus](https://github.com/solnic/virtus).

What Structure is **not**:

- It's not a database abstraction
- It's not a MVC framework (but it can be used to domain entities)
- It's not an attempt to simulate classic inheritance in JavaScript

## Getting started

`npm install --save structure`

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

## Support and compatibility

Structure is built on top of modern JavaScript, using new features like [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy), [Reflect](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect) and [Symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol). That being so, there are some things regarding compatibility you should consider when using Structure.

### Node

Node has only implemented all the used features at version 10, so for using Structure for a backend application you'll need Node 10 or later.

### Browser

We have a [UMD version](https://github.com/talyssonoc/structure/blob/master/dist/structure.js) for usage in browsers. Right now the tests are ran both in Node (using the original code) and in Electron (using the UMD version) and the whole test suite passes for both cases. Since we use modern JavaScript features inside the lib (like [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)), older browsers may not support it. Polyfilling them may be an option but it's not oficially supported.

## BattleCry generators

There are configurable [BattleCry](https://github.com/pedsmoreira/battlecry) generators ready to be downloaded and help scaffolding schema:

```sh
npm install -g battlecry
cry download generator talyssonoc/structure
cry g schema user name age:int:required cars:string[] favoriteBook:book friends:user[]:default :updateAge
```

Run `cry --help` to check more info about the generators available;

## [Contributing](contributing.md)

## [LICENSE](license.md)
