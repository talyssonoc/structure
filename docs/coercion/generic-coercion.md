# Generic coercion

If the declared type is not a primitive nor Array (or an array subclass) it'll do generic coercion. When generic coercing a value, Structure will just instantiate the declared type (using `new`) passing the raw value as the parameter (only if the raw value isn't of the declared type already).

```javascript
class Location {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

const User = attributes({
  location: Location
})(class User { });

const userOne = new User({
  location: new Location({ x: 1, y: 2 })
});

userOne.location; // Location { x: 1, y: 2 } => no coercion was done


const userTwo = new User({
  location: { x: 3, y: 4 }
});

userTwo.location; // Location { x: 3, y: 4 } => coerced plain object to Location
```

Coercion to `Date` type enters in this same category, so if you have an attribute of the type `Date`, it'll use `new Date(<raw value>)` to coerce it. For more info about how this coercion works check the cases for `value` and `dateString` parameters on [Date documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
