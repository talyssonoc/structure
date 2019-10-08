const validations = [
  require('./validations/string'),
  require('./validations/number'),
  require('./validations/boolean'),
  require('./validations/date'),
];

const NestedValidation = require('./validations/nested');
const arrayValidation = require('./validations/array');

module.exports = function validationForAttribute(attributeDefinition) {
  if (attributeDefinition.isArrayType) {
    return arrayValidation(attributeDefinition);
  }

  const validation = validations.find((v) => v.type === attributeDefinition.options.type);

  if (!validation) {
    return NestedValidation.forType(attributeDefinition);
  }

  return validation.createJoiSchema(attributeDefinition);
};
