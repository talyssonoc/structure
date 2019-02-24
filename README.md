# <a href="https://structure.js.org/"><img src="https://raw.githubusercontent.com/talyssonoc/structure/master/structure.jpg" width="300"></a>

## A simple schema/attributes library built on top of modern JavaScript

[![npm](https://img.shields.io/npm/v/structure.svg?style=flat)](https://www.npmjs.com/package/structure) [![Build Status](https://travis-ci.org/talyssonoc/structure.svg?branch=master)](https://travis-ci.org/talyssonoc/structure) [![Coverage Status](https://coveralls.io/repos/github/talyssonoc/structure/badge.svg?branch=master)](https://coveralls.io/github/talyssonoc/structure?branch=master) [![Code Climate](https://codeclimate.com/github/talyssonoc/structure/badges/gpa.svg)](https://codeclimate.com/github/talyssonoc/structure) [![JS.ORG](https://img.shields.io/badge/js.org-structure-ffb400.svg?style=flat)](https://js.org/)
---
Structure provides a simple interface which allows you to add attributes to your ES6 classes based on a schema, with validations and type coercion.

## Use cases

You can use Structure for a lot of different cases, including:

- Domain entities and value objects
- Model business rules
- Validation and coercion of request data
- Map pure objects and JSON to your application classes
- Add attributes to classes that you can't change the class hierarchy

Structure was inspired by Ruby's [Virtus](https://github.com/solnic/virtus).

What Structure is __not__:

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
    default: 18
  },
  birthday: Date
})(class User {
  greet() {
    return `Hello ${this.name}`;
  }
});

/* The attributes "wraps" the Class, still providing access to its methods: */

const user = new User({
  name: 'John Foo'
});

user.name; // 'John Foo'
user.greet(); // 'Hello John Foo'
```

## Support and compatibility

Structure is built on top of modern JavaScript, using new features like [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy), [Reflect](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect) and [Symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol). That being so, there are some things regarding compatibility you should consider when using Structure.

### Node

Node only implemented all the used features on version 6, so for using Structure for a backend application you'll need Node 6 or later.

### Browser

Not all major browsers implemented the used features so you'll need to transpile the code for using it. For browser usage we have the [UMD version](https://github.com/talyssonoc/structure/blob/master/dist/structure.js) bundled with Webpack. We don't bundle Structure with its dependencies so you'll have to provide it with your module bundler. It's recommended to replace joi with [joi-browser](https://www.npmjs.com/package/joi-browser) when using it on the front-end, here's how we run our test suite on the browser regarding [bundling](https://github.com/talyssonoc/structure/blob/master/test/karma.conf.js#L3-L11) and [polyfill of features](https://github.com/talyssonoc/structure/blob/master/test/browserSetup.js#L1-L2).

Be aware that not the whole test suite will pass on browsers, there are some cases that can't be simulated through polyfilling, like extending Array or having a non-structure class extending a structure class. You can setup the project on your computer and run npm run test:browser to see how it'll work.

Right now 95.5% of the tests will pass on Chrome 55, and 95% will pass on Firefox 45. We intend to make it support older versions using polyfills in the next releases.

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
