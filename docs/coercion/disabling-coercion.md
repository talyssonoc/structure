# Disabling coercion

You can disable coercion for a whole structure or for attributes individually using the `coercion` option in the schema and attribute options, respectively. Notice that it will cause validation to fail when the passed value is not of the expected value:

## Disabling for the whole structure

```js
const User = attributes(
  {
    name: String,
    age: Number,
  },
  {
    coercion: false,
  }
)(class User {});

const user = new User({ name: 123, age: '42' });

user.name; // 123
user.age; // '42'

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"name" must be a string', path: ['name'] },
  { message: '"age" must be a number', path: ['age'] }
]
*/
```

## Disabling for specific attributes

```js
const User = attributes({
  name: { type: String, coercion: false },
  age: Number,
})(class User {});

const user = new User({ name: 123, age: '42' });

user.name; // 123
user.age; // 42

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"name" must be a string', path: ['name'] }
]
*/
```

## Overwritting structure option with attribute option

If you define the `coercion` option both for the structure _and_ for an attribute, the structure one will apply for the whole schema except the specific attributes that overwrite it:

```js
const User = attributes(
  {
    name: { type: String, coercion: true },
    age: Number,
  },
  {
    coercion: false,
  }
)(class User {});

const user = new User({ name: 123, age: '42' });

user.name; // '123'
user.age; // '42'

const { valid, errors } = user.validate();

valid; // false
errors; /*
[
  { message: '"age" must be a number', path: ['age'] }
]
*/
```
