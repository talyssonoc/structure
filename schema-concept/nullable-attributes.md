# Nullable attributes

You can change the way an attribute is treated when the value `null` is assigned to it by using the `nullable` option with the value `true`, this would affect the way the attribute is defaulted, coerced, validated and serialized.

If you do not set the `nullable` option it will default to `false` and automatically make your attribute **non-nullable**.

## Nullability and `default` option

Non-nullable attributes with the value `null` will fallback to the value set as default the same way `undefined` does. But if the attribute is nullable, it will **only** fallback to the default if its value is `undefined`.

```javascript
const User = attributes({
  name: {
    // automatically non-nullable
    type: String,
    default: 'Some string',
  },
  nickname: {
    type: String,
    nullable: false,
    default: 'Some other string',
  },
})(class User {});

const userA = new User({ name: null, nickname: null });
userA.attributes; // { name: 'Some string', nickname: null }

const userB = new User({ name: null, nickname: undefined });
userB.attributes; // { name: 'Some string', nickname: 'Some other string' }
```

## Coercion

Non-nullable values will fallback to their null-equivalent values. More details about it can be found at the [coercion](https://github.com/talyssonoc/structure/tree/3f527c1185c866a03a33d3ac10d0ef4c32d1f050/docs/schema-concept/coercion/README.md) section. Nullable attributes will remain `null` as described in the section above.

```javascript
/*
 * User.js
 */
const User = attributes({
  name: {
    type: String,
    nullable: true,
  },
  nickname: {
    // automatically non-nullable
    type: String,
    empty: true,
  },
  age: Number, // << automatically non-nullable
  active: Boolean, // << automatically non-nullable
  createdAt: Date, // << automatically non-nullable
})(class User {});

const user = new User({
  name: null,
  nickname: null,
  age: null,
  active: null,
  createdAt: null,
});

// Only non-nullable values are coerced to their null-equivalent values
user.attributes; // { name: null, nickname: '', age: 0, active: false, createdAt: 1970-01-01T00:00:00.000Z }
user.validate(); // { valid: true }
```

### Nullable optional attributes

When you set an optional attribute to be **nullable** you are choosing not to assign a default value for it when instantiating your structure passing `null` as the value of this attribute, so the actual value will be `null` and will be considered valid.

```javascript
/*
 * User.js
 */
const User = attributes({
  name: {
    type: String,
    nullable: true,
  },
})(class User {});

const user = new User({
  name: null,
});

user.attributes; // { name: null }
user.validate(); // { valid: true }
```

### Nullable required attributes

We consider that when an attribute is **required** there should be some value assigned to it even if it's `undefined`, `null` or any other value. It means that coercion will never assign a **default** value to **required** attributes even if **nullable** option is **false**.

```javascript
/*
 * User.js
 */
const User = attributes({
  name: {
    type: String,
    required: true,
    nullable: false, // non-nullable required attribute
  },
})(class User {});

const user = new User({
  name: null,
});

user.attributes; // { name: null }
user.validate(); // { valid: false }
```

But notice that you can choose to allow **null** values on **required** attributes which will cause the validation to return **true**.

```javascript
/*
 * User.js
 */
const User = attributes({
  name: {
    type: String,
    required: true,
    nullable: true,
  },
})(class User {});

const user = new User({
  name: null,
});

user.attributes; // { name: null }
user.validate(); // { valid: true }
```

## Nullability and serialization

Usually an attribute with the value **undefined** or **null** is not included when you serialize your structure. But when it is **nullable** and its value is `null`, this attribute is going to be returned in your serialized schema.

```javascript
const User = attributes({
  name: {
    type: String,
    nullable: false,
  },
  nickname: {
    type: String,
    nullable: true,
  },
})(class User {});

const user = new User({ name: undefined, nickname: null });
user.toJSON(); // { nickname: null }
```

**Important:**

* Notice that by not using the `nullable` option the **default** value for **String** is an empty string, which means that you need to accept empty strings to make your schema valid.

