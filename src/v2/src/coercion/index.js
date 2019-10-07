const arrayCoercionFor = require('./coercions/array');
const genericCoercionFor = require('./coercions/generic');
const Coercion = require('./coercion');

const types = [
  require('./coercions/string'),
  require('./coercions/number'),
  require('./coercions/boolean'),
  require('./coercions/date'),
];

exports.for = function coercionFor(typeDefinition, itemTypeDefinition) {
  if (itemTypeDefinition) {
    return arrayCoercionFor(typeDefinition, itemTypeDefinition);
  }

  const coercion = getCoercion(typeDefinition);

  return Coercion.create(coercion, typeDefinition);
};

function getCoercion(typeDefinition) {
  const coercion = types.find((c) => c.type === typeDefinition.options.type);

  if (coercion) {
    return coercion;
  }

  return genericCoercionFor;
}
