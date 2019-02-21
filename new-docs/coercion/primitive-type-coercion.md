# Primitive type coercion

It'll do primitive type coercion when it tries to coerce values to `String`, `Number` or `Boolean` types.

For those types we basically use the type as a function (without using `new`), with a subtle difference: When coercing `null` to `String`, it'll coerce to empty string instead of the string `'null'`. For example:

```js
const User = attributes({
  name: String,
  age: Number,
  isAdmin: Boolean
})(class User { });

const userOne = new User({
  name: 'Foo Bar',
  age: 50,
  isAdmin: true
});

userOne.name; // 'Foo Bar' => no coercion was done
userOne.age; // 50 => no coercion was done
userOne.isAdmin; // true => no coercion was done

const userTwo = new User({
  name: null,
  age: '100',
  isAdmin: undefined
});

userTwo.name; // '' => coerced `null` to empty string
userTwo.age; // 100 => coerced string to number
userTwo.isAdmin; // undefined => it'll never coerce `undefined`
```
