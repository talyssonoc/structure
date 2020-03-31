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
