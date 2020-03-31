# Custom setters and getters

Sometimes it may be necessary to have custom setters and/or getters for some attributes. Structure allows you to do that using native JavaScript setters and getters. It will even support coercion.

It's important to notice that you **should not** try to access the attribute directly inside its getter or to set it directly inside its setter because it will cause infinite recursion, this is default JavaScript behavior. To access an attribute value inside its getter you should use `this.get(attributeName)`, and to set the value of an attribute a setter you should use `this.set(attributeName, attributeValue)`:

```js
const User = attributes({
  firstName: String,
  lastName: String,
  age: Number,
})(
  class User {
    get firstName() {
      return `-> ${this.get('firstName')}`;
    }

    set lastName(newLastname) {
      return this.set('lastName', `Mac${newLastName}`);
    }

    get age() {
      // do NOT do that. Instead, use this.get and this.set inside getters and setters
      return this.age * 1000;
    }

    // this is NOT an attribute, just a normal getter
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
);

const user = new User({ firstName: 'Connor', lastName: 'Leod' });

user.firstName; // -> Connor
user.lastName; // MacLeod
user.fullName; // -> Connor MacLeod
```

## Inheritance

Custom setters and getters are also inherited, be your superclass a pure JavaScript class or another structure:

```js
class Person {
  // If Person was a structure instead of a pure class, that would work too
  get name() {
    return 'The person';
  }
}

const User = attributes({
  name: String,
})(class User extends Person {});

const user = new User({ name: 'Will not be used' });

user.name; // -> The person
```

**Important**

JavaScript nativelly won't let you inherit only one of the accessors (the getter or the setter) if you define the other accessor in a subclass:

```js
class Person {
  get name() {
    return 'Person';
  }
}

class User extends Person {
  set name(newName) {
    this._name = newName;
  }
}

const user = new Person();
user.name = 'The user';
user.name; // -> The user
```

It happens because _once you define one of the accessors in a subclass_, all the accessors for the same attribute inherited from the superclass will be ignored.

While it's a weird behavior, Structure will follow the same functionality so the Structure classes inheritance work the same way of pure JavaScript classes, avoiding inconsistencies.
