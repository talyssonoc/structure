const { isFunction, curryRight } = require('lodash');

exports.execute = curryRight(
  function(value, coercion, typeDescriptor) {
    if(value === undefined) {
      return;
    }

    if (value === null) {
      return getNullableValue(coercion, typeDescriptor);
    }

    if (coercion.isCoerced(value, typeDescriptor)) {
      return value;
    }

    return coercion.coerce(value, typeDescriptor);
  }
);

function getNullableValue(coercion, typeDescriptor) {
  return typeDescriptor.nullable === true ? null : getDefaultValue(coercion);
}

function getDefaultValue(coercion) {
  return isFunction(coercion.default) ? coercion.default() : coercion.default;
}
