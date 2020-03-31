# Testing

If you use Jest, Structure has a Jest extension called [`jest-structure`](https://www.npmjs.com/package/jest-structure) that provides assertions to make it easy to test intances.

## Installation

jest-structure is available in npm, so you can install it with npm or yarn as a development dependency:

```bash
npm install --save-dev jest-structure

# or

yarn --dev add jest-structure
```

## Setup

After installing, you need to tell Jest to use jest-structure, this can be done in two ways:

By importing and manually adding it to Jest:

```javascript
import jestStructure from 'jest-structure';

expect.extend(jestStructure);
```

Or by allowing jest-structure to add itself to Jest matchers:

```javascript
import 'jest-structure/extend-expect';
```

Both ways can be done in a [setup file](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array) or directly at the top of your test file

## Matchers

### `toBeValidStructure()`

This matcher passes if the structure is _valid_:

```javascript
const User = attributes({
  name: { type: String, required: true },
})(class User {});

const validUser = new User({ name: 'Me' });

expect(validUser).toBeValidStructure(); // passes

const invalidUser = new User();

expect(invalidUser).toBeValidStructure(); // fails
```

### `toBeInvalidStructure()`

This matcher passes if the structure is _invalid_:

```javascript
const User = attributes({
  name: { type: String, required: true },
})(class User {});

const invalidUser = new User();

expect(invalidUser).toBeInvalidStructure(); // passes

const validUser = new User({ name: 'Me' });

expect(validUser).toBeInvalidStructure(); // fails
```

## `toHaveInvalidAttribute(path, messages)`

This matcher allows you to assert that a _single attribute_ of the structure is invalid, optionally passing the array of error messages for that attribute:

```javascript
const User = attributes({
  name: { type: String, required: true },
  age: { type: Number, required: true },
})(class User {});

const user = new User({ age: 42 });

// passes, because name is invalid
expect(user).toHaveInvalidAttribute(['name']);

// fails, because age is valid
expect(user).toHaveInvalidAttribute(['age']);

// passes, because name is invalid with this message
expect(user).toHaveInvalidAttribute(['name'], ['"name" is required']);

// fails, because name is invalid but not with this message
expect(user).toHaveInvalidAttribute(['name'], ['"name" is not cool']);

// passes. Notice that you can even use arrayContaining to check for a subset of the errros
expect(user).toHaveInvalidAttribute(['name'], expect.arrayContaining(['"name" is required']));

// passes. And stringContaining can be used as well
expect(user).toHaveInvalidAttribute(['name'], [expect.stringContaining('required')]);
```

## `toHaveInvalidAttributes([ { path, messages } ])`

This matcher allows you to assert that _multiple attributes_ of the structure are invalid, optionally passing the array of error messages for each attribute:

```javascript
const User = attributes({
  name: { type: String, required: true },
  age: { type: Number, required: true },
})(class User {});

const user = new User({ age: 42 });

// passes, because name is invalid
expect(user).toHaveInvalidAttributes([{ path: ['name'] }]);

// fails, because age is valid
expect(user).toHaveInvalidAttributes([{ path: ['age'] }]);

// fails, because name is invalid but age is valid
expect(user).toHaveInvalidAttributes([{ path: ['name'] }, { path: ['age'] }]);

// passes, because name is invalid with this message
expect(user).toHaveInvalidAttributes([{ path: ['name'], messages: ['"name" is required'] }]);

// fails, because name is invalid but not with this message
expect(user).toHaveInvalidAttributes([{ path: ['name'], messages: ['"name" is not cool'] }]);

// passes. Notice that you can even use arrayContaining to check for a subset of the errros
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: expect.arrayContaining(['"name" is required']) },
]);

// passes. And stringContaining can be used as well
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: [expect.stringContaining('required')] },
]);
```

