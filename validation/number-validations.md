# Number validations

* `required`: can't be undefined \(default: `false`\)
* `equal`: **\*** equal to passed value
* `integer`: must be an integer \(default: `false`\)
* `precision`: maximum number of decimal places
* `positive`: must be positive \(default: `false`\)
* `negative`: must be negative \(default: `false`\)
* `multiple`: must be a multiple of the passed value
* `min`: **\*\*** minimum valid value \(works like the `>=` operator\)
* `greater`: **\*\*** must be greater than passed value \(works like the `>` operator\)
* `max`: **\*\*** maximum valid value \(works like the `<=` operator\)
* `less`: **\*\*** must be smaller than passed value \(works like the `<` operator\)
* `nullable`: accepts null \(default: `false`\)

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
  },
  capacity: {
    type: Number,
    nullable: true
  }
})(class Pool {
  getVolume() {
    return this.depth * this.width * this.length;
  }
});
```

