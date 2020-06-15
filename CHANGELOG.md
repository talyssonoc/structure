## 2.0.1 - 2020-06-15

Fix:

- Fix deep nested dynamic types validation

## 2.0.0 - 2020-03-31

Refactors:

- The whole part of schemas and attribute definitions was refactored
- Tests are now run by Jest (and Electron for browser tests)
- Prettier was added
- Move to mono-repo

Enhancements

- Implement jest-structure assertions
- It's possible to set custom getters e setters directly in the structure class
- Allows to disable coercion

Breaking changes:

- Joi is updated to v16
  - Attribute path in validation _errors_ is an array instead of a string
  - Attribute path in validation _messages_ contains the whole path joined by '.'
  - The name used for the dynamic import should aways be the same as the name of its type or else a custom identifier must be used
- Non-nullable attributes with value null will use default value the same way undefined does
- Structure classes now have two methods to generically set and get the value of the attributes, `.get(attributeName)` and `.set(attributeName, attributeValue)`
- Minimum Node version is now 10

Docs:

- Rename the term `type descriptor` to `attribute definition` in the docs and in the code
- Reorganize and add more specific pages to docs

## 2.0.0-alpha.4 - 2020-03-21

- Publish only src folder for jest-structure

## 2.0.0-alpha.3 - 2020-03-20

- Reorganize md files

## 2.0.0-alpha.2 - 2020-03-19

- Invert symlinks

## 2.0.0-alpha.1 - 2020-03-19

- Add symlinks to md files to packages/structure

## 2.0.0-alpha.0 - 2020-03-19

Refactors:

- The whole part of schemas and attribute definitions was refactored
- Tests are now run by Jest (and Electron for browser tests)
- Prettier was added
- Move to mono-repo

Enhancements

- Implement jest-structure assertions
- It's possible to set custom getters e setters directly in the structure class

Breaking changes:

- Joi is updated to v16
  - Attribute path in validation _errors_ is an array instead of a string
  - Attribute path in validation _messages_ contains the whole path joined by '.'
  - The name used for the dynamic import should aways be the same as the name of its type or else a custom identifier must be used
- Non-nullable attributes with value null will use default value the same way undefined does
- Structure classes now have two methods to generically set and get the value of the attributes, `.get(attributeName)` and `.set(attributeName, attributeValue)`
- Minimum Node version is now 10

## 1.8.0 - 2019-09-16

Enhancements:

- Add `unique` validation to arrays

## 1.7.0 - 2019-09-14

Enhancements:

- Add method to clone structures

## 1.6.0 - 2019-08-27

Enhancements:

- Allow custom error class to static mode

## 1.5.0 - 2019-07-08

Enhancements:

- Add `buildStrict` static method

## 1.4.0 - 2019-03-26

Enhancements:

- Add `nullable` option

## 1.3.2 - 2019-03-22

Fix:

- The actual instance is passed to the dynamic defaults

## 1.3.0 - 2018-03-23

Enhancements:

- When using default function to initialize attributes you can now refer to another attribute values to compose value

## 1.2.0 - 2017-02-01

Features:

- Allow circular reference on type definitions ([@talyssonoc](https://github.com/talyssonoc/structure/pull/30))

Enhancements:

- Make validation faster ([@talyssonoc](https://github.com/talyssonoc/structure/pull/28))

Dependencies update:

- Update joi from 9.2.0 to 10.2.0 ([@talyssonoc](https://github.com/talyssonoc/structure/pull/26))

## 1.1.0 - 2017-01-17

- Added static method `validate()` to structures ([@talyssonoc](https://github.com/talyssonoc/structure/pull/25))
