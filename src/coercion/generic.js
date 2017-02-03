const getType = require('../typeResolver');

module.exports = function genericCoercionFor(typeDescriptor) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    const type = getType(typeDescriptor);

    if(value instanceof type) {
      return value;
    }

    return new type(value);
  };
};
