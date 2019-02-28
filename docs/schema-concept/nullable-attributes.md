# Nullable attributes

You can change the way an attribute is treated when the value `null`is assigned to it by using the `nullable` option with the value `true`, this would affect the way the attribute is coerced, validated and serialized.

If you do not set the `nullable` option for an attribute it will default to `false` and make your attribute __not nullable__.

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

### Nullable optional attributes

When you set an optional attribute to be __nullable__ you are choosing not to assign a default value for it when instantiating your structure passing `null` as the value of this attribute, so the actual value will be `null` and will be considered valid.

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

### Nullable required attributes

We consider that when an attribute is __required__ there should be some value assigned to it even if it's `undefined`, `null` or any other value. It means that coercion will never assign a __default__ value to __required__ attributes even if __nullable__ option is __false__.

```javascript
/*
 * User.js
*/
const User = attributes({
  name: {
    type: String,
    required: true,
    nullable: false // non-nullable required attribute
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

- Notice that by not using the `nullable` option the __default__ value for __String__ is an empty string, which means that you need to accept empty strings to make your schema valid.

- Notice that usually an attribute with the value __undefined__ or __null__ is not included when you serialize your structure, but when it is __nullable__ this attribute is going to be returned in your serialized schema.
