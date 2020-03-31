const arrayCoercion = require('./coercions/array');
const genericCoercionFor = require('./coercions/generic');
const Coercion = require('./coercion');

const types = [
  require('./coercions/string'),
  require('./coercions/number'),
  require('./coercions/boolean'),
  require('./coercions/date'),
];

exports.for = function coercionFor(attributeDefinition) {
  if (!attributeDefinition.options.coercion) {
    return Coercion.disabled;
  }

  const coercion = getCoercion(attributeDefinition);

  return Coercion.create(coercion, attributeDefinition);
};

function getCoercion(attributeDefinition) {
  if (attributeDefinition.isArrayType) {
    return arrayCoercion;
  }

  const coercion = types.find((c) => c.type === attributeDefinition.options.type);

  if (coercion) {
    return coercion;
  }

  return genericCoercionFor;
}
