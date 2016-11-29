const joi = require('joi');
const { SCHEMA } = require('../symbols');

module.exports = function nestedValidation(typeDescriptor) {
  var joiSchema = joi.object();
  var typeSchema = typeDescriptor.type[SCHEMA];

  if(typeSchema !== undefined) {
    var nestedValidations = {};

    Object.keys(typeSchema).forEach((v) => {
      nestedValidations[v] = typeSchema[v].validation;
    });

    joiSchema = joiSchema.keys(nestedValidations);
  }

  if(typeDescriptor.required) {
    joiSchema = joiSchema.required();
  }

  return joiSchema;
};
