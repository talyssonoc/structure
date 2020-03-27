# Coercion

Structure does type coercion based on the declared [schema](../schema-concept/README.md), let's break it into 3 categories:

- [Primitive type coercion](primitive-type-coercion.md)
- [Arrays coercion](arrays-and-array-subclasses.md)
- [Generic coercion](generic-coercion.md)

## Observations

Structure **never** coerces the following scenarios:

- value is `undefined`;
- value is `null` when `nullable` option is enabled;
- value is already of the declared type (except for arrays, we'll talk more about this soon).

Also, Structure only does **array items coercion** during instantiation, so mutating an array (using push, for example) won't coerce the new item:

```javascript
const Library = attributes({
  books: {
    type: Array,
    itemType: String,
  },
})(class Library {});

const library = new Library({
  books: [1984],
});

library.books; // ['1984'] => coerced number to string

library.books.push(42);

library.books; // ['1984', 42] => new item was not coerced
```
