# Schema Concept

The schema is an object responsible to map the attributes Structure should handle, it is the parameter of the `attributes` function.

```js
attributes({
  name: String,
  age: Number,
})(class User {});
```

There are two ways to declare an attribute of the schema, the **shorthand attribute definition** and the **complete attribute definition**.
