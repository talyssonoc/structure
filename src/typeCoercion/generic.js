module.exports = function genericCoercionFor(typeDescriptor) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    var type;

    if(typeDescriptor.dynamicType) {
      type = typeDescriptor.getType();
    } else {
      type = typeDescriptor.type;
    }

    if(value instanceof type) {
      return value;
    }

    return new type(value);
  };
};
