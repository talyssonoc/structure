const arrayCoercionFor = require('./array');
const genericCoercionFor = require('./generic');

const types = [
  require('./string'),
  require('./number'),
  require('./boolean')
];

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
