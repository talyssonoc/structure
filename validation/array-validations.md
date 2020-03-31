# Array validations

* `required`: can't be undefined \(default: `false`\)
* `sparse`: can have undefined items \(default: `true`\)
* `unique`: can't have duplicate items \(default: `false`\)
* `minLength`: minimum quantity of items
* `maxLength`: maximum quantity of items
* `exactLength`: exact quantity of items

```javascript
const Group = attributes({
  members: {
    type: Array,
    itemType: String,
    minLength: 2,
    maxLength: 5,
    sparse: false,
    unique: true
  },
  leaders: {
    type: Array,
    itemType: String,
    minLength: 1,
    maxLength: { attr: 'members' }
  }
})
```

