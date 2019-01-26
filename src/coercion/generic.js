const getType = require('../typeResolver');

module.exports = function genericCoercionFor(typeDescriptor) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    const type = getType(typeDescriptor);

    if(!needsCoercion(value, type, typeDescriptor.nullable)) {
      return value;
    }

    return new type(value);
  };
};

function needsCoercion(value, type, nullable) {
  return (value !== null || !nullable) && !(value instanceof type);
}
