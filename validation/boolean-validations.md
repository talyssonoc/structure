# Boolean validations

* `required`: can't be undefined \(default: `false`\)
* `equal`: **\*** equal to passed value
* `nullable`: accepts null \(default: `false`\)

```javascript
const User = attributes({
  isAdmin: {
    type: Boolean,
    required: true
  },
  hasAcceptedTerms: {
    type: Boolean,
    nullable: true
  }
})(class User { });
```

