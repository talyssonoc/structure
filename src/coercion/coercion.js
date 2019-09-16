const { isFunction, curryRight } = require('lodash');

exports.execute = curryRight(function(value, coercion, typeDescriptor) {
  if (value === undefined) {
    return;
  }

  if (value === null) {
    return getNullableValue(coercion, typeDescriptor);
  }

  if (coercion.isCoerced(value, typeDescriptor)) {
    return value;
  }

  return coercion.coerce(value, typeDescriptor);
});

function getNullableValue(coercion, typeDescriptor) {
  return needsNullableInitialization(typeDescriptor)
    ? getNullValue(coercion)
    : null;
}

function needsNullableInitialization(typeDescriptor) {
  return !typeDescriptor.required && !typeDescriptor.nullable;
}

function getNullValue(coercion) {
  return isFunction(coercion.nullValue)
    ? coercion.nullValue()
    : coercion.nullValue;
}
