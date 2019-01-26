const arrayCoercionFor = require('./array');
const genericCoercionFor = require('./generic');

const types = [
  require('./string'),
  require('./number'),
  require('./boolean')
];

exports.for = function coercionFor(typeDescriptor, itemTypeDescriptor) {
  if(itemTypeDescriptor) {
    return arrayCoercionFor(typeDescriptor, itemTypeDescriptor);
  }

  const coercion = getCoercion(typeDescriptor);

  return createCoercionFunction(coercion, typeDescriptor);
};

function getCoercion(typeDescriptor) {
  return types.find((c) => c.type === typeDescriptor.type);
}

function createCoercionFunction(coercion, typeDescriptor) {
  if(!coercion) {
    return genericCoercionFor(typeDescriptor);
  }

  return function coerce(value, nullable) {
    if(value === undefined) {
      return;
    }

    if(needsCoercion(value, coercion, nullable)) {
      return coercion.coerce(value);
    }

    return value;
  };
}

function needsCoercion(value, coercion, nullable) {
  return (value !== null || !nullable) && !coercion.test(value);
}
