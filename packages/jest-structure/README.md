# jest-structure

Custom [Jest](https://www.npmjs.com/package/jest) matchers to test [Structure](https://www.npmjs.com/package/structure) instances.

## Example usage

```js
expect(user).toBeValidStructure()

expect(user).toBeInvalidStructure()

expect(user).toHaveInvalidAttribute(['name'])

expect(user).toHaveInvalidAttribute(['name'], ['"name" is required'])

expect(user).toHaveInvalidAttribute(['name'], expect.arrayContaining(['"name" is required']))

expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: expect.arrayContaining(['"name" is required']) },
  {
    path: ['age'],
    messages: [
      '"age" must be larger than or equal to 2',
      '"age" must be a positive number'
    ]
  }
])
```


## Installation

jest-structure is available in npm, so you can install it with npm or yarn as a development dependency:

```sh
npm install --save-dev jest-structure

# or

yarn --dev add jest-structure
```


## Setup

After installing, you need to tell Jest to use jest-structure, this can be done in two ways:

1. By importing and manually adding it to Jest (in a setup file or directly in the top of your test file):

```js
import jestStructure from 'jest-structure'

expect.extend(jestStructure);
```

2. By allowing jest-structure to add itself to Jest matchers:

```js
import 'jest-structure/extend-expect'
```

## Matchers

### `toBeValidStructure()`

This matcher passes if the structure is _valid_:

```js
const User = attributes({
  name: { type: String, required: true }
})(class User {})

const validUser = new User({ name: 'Me' })

expect(validUser).toBeValidStructure() // passes

const invalidUser = new User()

expect(invalidUser).toBeValidStructure() // fails
```

### `toBeInvalidStructure()`

This matcher passes if the structure is _invalid_:

```js
const User = attributes({
  name: { type: String, required: true }
})(class User {})

const invalidUser = new User()

expect(invalidUser).toBeInvalidStructure() // passes

const validUser = new User({ name: 'Me' })

expect(validUser).toBeInvalidStructure() // fails
```

## `toHaveInvalidAttribute(path, messages)`

This matcher allows you to assert that a _single attribute_ of the structure is invalid, optionally passing the array of error messages for that attribute:

```js
const User = attributes({
  name: { type: String, required: true },
  age: { type: Number, required: true }
})(class User {})

const user = new User({ age: 42 })

// passes, because name is invalid
expect(user).toHaveInvalidAttribute(['name'])

// fails, because age is valid
expect(user).toHaveInvalidAttribute(['age'])

// passes, because name is invalid with this message
expect(user).toHaveInvalidAttribute(['name'], ['"name" is required'])

// fails, because name is invalid but not with this message
expect(user).toHaveInvalidAttribute(['name'], ['"name" is not cool'])

// passes. Notice that you can even use arrayContaining to check for a subset of the errros
expect(user).toHaveInvalidAttribute(['name'], expect.arrayContaining(['"name" is required']))

// passes. And stringContaining can be used as well
expect(user).toHaveInvalidAttribute(['name'], [expect.stringContaining('required')])
```

## `toHaveInvalidAttributes([ { path, messages } ])`

This matcher allows you to assert that _multiple attributes_ of the structure are invalid, optionally passing the array of error messages for each attribute:

```js
const User = attributes({
  name: { type: String, required: true },
  age: { type: Number, required: true }
})(class User {})

const user = new User({ age: 42 })

// passes, because name is invalid
expect(user).toHaveInvalidAttributes([
  { path: ['name'] }
])

// fails, because age is valid
expect(user).toHaveInvalidAttributes([
  { path: ['age'] }
])

// fails, because name is invalid but age is valid
expect(user).toHaveInvalidAttributes([
  { path: ['name'] },
  { path: ['age'] }
])

// passes, because name is invalid with this message
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: ['"name" is required'] }
])

// fails, because name is invalid but not with this message
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: ['"name" is not cool'] }
])

// passes. Notice that you can even use arrayContaining to check for a subset of the errros
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: expect.arrayContaining(['"name" is required']) }
])

// passes. And stringContaining can be used as well
expect(user).toHaveInvalidAttributes([
  { path: ['name'], messages: [expect.stringContaining('required')] }
])
```
