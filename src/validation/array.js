const joi = require('joi');
const { mapToJoi } = require('./utils');

const joiMappings = [
  ['minLength', 'min', true],
  ['maxLength', 'max', true],
  ['exactLength', 'length', true],
  ['unique', 'unique']

];

module.exports = function arrayValidation(typeDescriptor, itemTypeDescriptor) {
  var joiSchema = joi.array().items(itemTypeDescriptor.validation);
  const canBeSparse =
    typeDescriptor.sparse === undefined || typeDescriptor.sparse;

  joiSchema = joiSchema.sparse(canBeSparse);

  joiSchema = mapToJoi(typeDescriptor, {
    initial: joiSchema,
    mappings: joiMappings,
  });

  return joiSchema;
};
