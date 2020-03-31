# Date validations

* `required`: can't be undefined \(default: `false`\)
* `equal`: **\*** equal to passed value
* `min`: **\*\*** must be after passed date
* `max` **\*\*** must be before passed date
* `nullable`: accepts null \(default: `false`\)

```javascript
const Product = attributes({
  fabricationDate: {
    type: Date,
    default: () => Date.now()
  },
  expirationDate: {
    type: Date,
    min: { attr: 'fabricationDate' }
  },
  createdAt: {
    type: Date,
    nullable: true
  }
})(class Product { });
```

