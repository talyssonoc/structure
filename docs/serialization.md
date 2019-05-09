# Serialization

It's possible to obtain a serialized object of a Structure using the method `toJSON()`. This method is also compliant with the [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) specification, so you can use it to serialize your object too.

**Important:**

- Be aware that `toJSON()` will return an object, not the JSON in form of a string like `JSON.stringify()` does
- Refer to the [Date#toJSON](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON) specification to see how dates will be serialized by `JSON.stringify`
- Refer to [Dealing with nullable attributes](schema-concept/nullable-attributes.md) to check how `nullables` are going to be returned on __Serialization__

```javascript
const Book = attributes({
  name: String
})(class Book { });

const User = attributes({
  name: String,
  birth: Date,
  books: {
    type: Array,
    itemType: Book
  }
})(class User { });

const user = new User({
  name: 'John Something',
  birth: new Date('10/10/1990'),
  books: [
    new Book({ name: 'The name of the wind' }),
    new Book({ name: 'Stonehenge' })
  ]
});

user.toJSON(); /* {
  name: 'John Something',
  birth: new Date('10/10/1990'),
  books: [
    { name: 'The name of the wind' },
    { name: 'Stonehenge' }
  ]
}
*/

JSON.stringify(user)); // {"name":"John Something","birth":"1990-10-10T03:00:00.000Z","books":[{"name":"The name of the wind"},{"name":"Stonehenge"}]}
```

### Use static toJSON to further modify serialized object:
**Important:**

- setting a static toJSON changes the result of toJSON, but does not modify the instance
- nested static toJSON methods are supported

```javascript
const  User = attributes({
  name: String,
  secret: String
})(class User {
  static toJSON(json) {
    json.secret = 'REDACTED';
    return json;
  }
});

const user = new User({
  name: 'John Something',
  secret: 'cries during weddings'
});

user.secret // 'cries during weddings'

user.toJSON(); /* {
  name: 'John Something',
  secret: 'REDACTED'
}
*/
```