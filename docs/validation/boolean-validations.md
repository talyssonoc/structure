# Boolean validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value

```javascript
const User = attributes({
  isAdmin: {
    type: Boolean,
    required: true
  }
})(class User { });
```
