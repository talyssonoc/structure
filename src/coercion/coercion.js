const { isFunction, curryRight } = require('lodash');

exports.execute = curryRight(
  function(value, coercion, typeDescriptor) {
    if(value === undefined) {
      return;
    }

    if (value === null) {
      return isFunction(coercion.default)
        ? coercion.default()
        : coercion.default;
    }

    if (coercion.isCoerced(value, typeDescriptor)) {
      return value;
    }

    return coercion.coerce(value, typeDescriptor);
  }
);
