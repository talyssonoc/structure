const { curryRight } = require('lodash');

exports.execute = curryRight(
  function(value, coercion, typeDescriptor) {
    if(value === undefined) {
      return;
    }

    if (value === null) {
      return coercion.default;
    }

    if (coercion.isCoerced(value, typeDescriptor)) {
      return value;
    }

    return coercion.coerce(value, typeDescriptor);
  }
);
