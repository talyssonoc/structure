module.exports = function genericCoercionFor(typeDescriptor) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    if(value instanceof typeDescriptor.type) {
      return value;
    }

    return new typeDescriptor.type(value);
  };
};
