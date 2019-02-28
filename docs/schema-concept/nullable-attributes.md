# Nullable attributes

Structure actually allow you to treat `null` values in different ways including accept or even ignore (default behavior) them during coercion and serialization.

When you choose to not map __nullable__ attributes on your __schema__ by default the value assigned will be __false__, therefore, expected behavior is gonna be to assume default values for those attributes.

```javascript
/*
 * User.js
*/
const User = attributes({
  name: {
    type: String,
    empty: true
  },
  age: Number,
  active: Boolean,
  createdAt: Date
})(class User { });

const user = new User({
  name: null,
  age: null,
  active: null,
  createdAt: null
});

user.attributes; // { name: '', age: 0, active: false, createdAt: 1970-01-01T00:00:00.000Z }
user.validate() // { valid: true }
```

Notice that the __default__ value for __String__ is empty, what it means that you need to accept empty values to turn your schema valid.

### Accepting nullables (optional attributes)

When you choose to accept __nullables__ in attributes that you actually not require our coercion functions will just not define a __default__ value for those attributes and will assign `null` to them.

```javascript
/*
 * User.js
*/
const User = attributes({
  name: {
    type: String,
    nullable: true
  }
})(class User { });

const user = new User({
  name: null
});

user.attributes; // { name: null }
user.validate() // { valid: true }
```

### Accepting nullables (required attributes)

We understand that when an attribute is required it should to be present and actually has a value assigned to it, even an `undefined`, `null` or whatever value what it means that coercion function will not assign a __default__ value even if __nullable__ attribute is __false__.

```javascript
/*
 * User.js
*/
const User = attributes({
  name: {
    type: String,
    required: true,
    nullable: false
  }
})(class User { });

const user = new User({
  name: null
});

user.attributes; // { name: null }
user.validate() // { valid: false }
```

But notice that you can choose to allow __null__ values on __required__ attributes which will cause the validation to return __true__.

```javascript
/*
 * User.js
*/
const User = attributes({
  name: {
    type: String,
    required: true,
    nullable: true
  }
})(class User { });

const user = new User({
  name: null
});

user.attributes; // { name: null }
user.validate() // { valid: true }
```

**Important:**

- Notice that usually an __undefined__ or __null__ value is not returned when you serialize your schema but when you accept a __nullable__ attribute this attribute is going also to be returned in your serialized schema, see [Serialization](serialization.md)
