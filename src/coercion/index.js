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
};
