const Errors = require('../errors');
const getType = require('../typeResolver');

module.exports = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
  return function coerceArray(value) {
    if(value === undefined) {
      return;
    }

    if(value === null || (value.length === undefined && !value[Symbol.iterator])) {
      throw Errors.arrayOrIterable();
    }

    if(Array.isArray(value)) {
      value = value.slice();
    } else {
      if(value[Symbol.iterator]) {
        value = Array(...value);
      }
    }

    const type = getType(typeDescriptor);
    const coercedValue = new type();

    for(let i = 0; i < value.length; i++) {
      coercedValue.push(itemTypeDescriptor.coerce(value[i]));
    }

    return coercedValue;
  };
};
