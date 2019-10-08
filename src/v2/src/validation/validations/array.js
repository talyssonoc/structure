const joi = require('@hapi/joi');
const { mapToJoi } = require('./utils');

const joiMappings = [
  ['minLength', 'min', true],
  ['maxLength', 'max', true],
  ['exactLength', 'length', true],
  ['unique', 'unique'],
];

module.exports = function arrayValidation(attributeDefinition) {
  let joiSchema = joi.array().items(attributeDefinition.itemTypeDefinition.validation);

  const { sparse } = attributeDefinition.options;

  const canBeSparse = sparse === undefined || sparse;

  joiSchema = joiSchema.sparse(canBeSparse);

  joiSchema = mapToJoi(attributeDefinition, {
    initial: joiSchema,
    mappings: joiMappings,
  });

  return joiSchema;
};
