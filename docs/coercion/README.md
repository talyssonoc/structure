# Coercion

Structure does type coercion based on the declared [schema](../schema-concept/README.md). It's important to note that it __never__ coerces `undefined` and it also won't coerce if the value is already of the declared type (except for arrays, we'll talk more about this soon). Let's break the coercion into 3 categories.
