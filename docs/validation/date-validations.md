# Date validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value
- `min`: __**__ must be after passed date
- `max` __**__ must be before passed date
- `nullable`: accepts null (default: `false`)

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
