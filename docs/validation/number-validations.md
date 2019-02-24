# Number validations

- `required`: can't be undefined (default: `false`)
- `equal`: __*__ equal to passed value
- `integer`: must be an integer (default: `false`)
- `precision`: maximum number of decimal places
- `positive`: must be positive (default: `false`)
- `negative`: must be negative (default: `false`)
- `multiple`: must be a multiple of the passed value
- `min`: __**__ minimum valid value (works like the `>=` operator)
- `greater`: __**__ must be greater than passed value (works like the `>` operator)
- `max`: __**__ maximum valid value (works like the `<=` operator)
- `less`: __**__ must be smaller than passed value (works like the `<` operator)

```javascript
const Pool = attributes({
  depth: {
    type: Number,
    positive: true
  },
  width: {
    type: Number,
    min: { attr: 'depth' }
  },
  length: {
    type: Number,
    greater: { attr: 'width' }
  }
})(class Pool {
  getVolume() {
    return this.depth * this.width * this.length;
  }
});
```
