const arrayCoercionFor = require('./array');
const genericCoercionFor = require('./generic');
const Coercion = require('./coercion');

const types = [
  require('./string'),
  require('./number'),
  require('./boolean'),
  require('./date'),
];

exports.for = function coercionFor(typeDescriptor, itemTypeDescriptor) {
  if (itemTypeDescriptor) {
    return arrayCoercionFor(typeDescriptor, itemTypeDescriptor);
  }

  const coercion = getCoercion(typeDescriptor);

  return Coercion.execute(coercion, typeDescriptor);
};

function getCoercion(typeDescriptor) {
  const coercion = types.find((c) => c.type === typeDescriptor.type);

  if (coercion) {
    return coercion;
  }

  return genericCoercionFor;
}
