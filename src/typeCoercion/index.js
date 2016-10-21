const types = [
  require('./string'),
  require('./number'),
  require('./boolean')
];

function genericCoercionFor(typeDescriptor) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    if(value instanceof typeDescriptor.type) {
      return value;
    }

    return new typeDescriptor.type(value);
  };
}

function arrayCoercionFor(typeDescriptor, itemsTypeDescriptor) {
  return function coerceArray(value) {
    if(value === undefined) {
      return;
    }

    if(value === null || (value.length === undefined && !value[Symbol.iterator])) {
      throw new Error('Value must be iterable or array-like.');
    }

    if(value[Symbol.iterator]) {
      value = Array(...value);
    }

    const coercedValue = new typeDescriptor.type();

    for(let i = 0; i < value.length; i++) {
      coercedValue.push(itemsTypeDescriptor.coerce(value[i]));
    }

    return coercedValue;
  };
}

function coercionFor(typeDescriptor, itemsTypeDescriptor) {
  if(itemsTypeDescriptor) {
    return arrayCoercionFor(typeDescriptor, itemsTypeDescriptor);
  }

  const coercion = types.find((c) => c.type === typeDescriptor.type);

  if(!coercion) {
    return genericCoercionFor(typeDescriptor);
  }

  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    if(coercion.test && coercion.test(value)) {
      return value;
    }

    return coercion.coerce(value);
  };
}

exports.coercionFor = coercionFor;
