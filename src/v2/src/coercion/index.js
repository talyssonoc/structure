const arrayCoercion = require('./coercions/array');
const genericCoercionFor = require('./coercions/generic');
const Coercion = require('./coercion');

const types = [
  require('./coercions/string'),
  require('./coercions/number'),
  require('./coercions/boolean'),
  require('./coercions/date'),
];

exports.for = function coercionFor(typeDefinition) {
  const coercion = getCoercion(typeDefinition);

  return Coercion.create(coercion, typeDefinition);
};

function getCoercion(typeDefinition) {
  if (typeDefinition.isArrayType) {
    return arrayCoercion;
  }

  const coercion = types.find((c) => c.type === typeDefinition.options.type);

  if (coercion) {
    return coercion;
  }

  return genericCoercionFor;
}
