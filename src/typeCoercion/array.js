module.exports = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
  return function coerceArray(value) {
    if(value === undefined) {
      return;
    }

    if(value === null || (value.length === undefined && !value[Symbol.iterator])) {
      throw new TypeError('Value must be iterable or array-like.');
    }

    if(value[Symbol.iterator]) {
      value = Array(...value);
    }

    const coercedValue = new typeDescriptor.type();

    for(let i = 0; i < value.length; i++) {
      coercedValue.push(itemTypeDescriptor.coerce(value[i]));
    }

    return coercedValue;
  };
};
