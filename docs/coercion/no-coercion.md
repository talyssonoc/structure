# No coersion

Structure does not type coercion if use `coerceAttributtes = false` in schemaOptions:

```js
const { attributes } = require('./src');

const Person = attributes({
    name: {
      type: String
    },
    age: Number
},{
  coerceAttributes: false
})(class Person {});

let person = new Person({
  name: 'Person 1',
  age: '20'
});

console.log(person.validate().valid); // false
console.log(person.age);              // '20'
console.log(typeof person.age);       // string
```