const joi = require('joi');
const { SCHEMA } = require('../symbols');

module.exports = function nestedValidation(typeDescriptor) {
  var joiSchema = joi.object();

  if(typeDescriptor.dynamicType) {

  } else {
    const typeSchema = typeDescriptor.type[SCHEMA];

    const nestedValidations = Object.keys(typeSchema)
      .reduce((validations, v) => {
        validations[v] = typeSchema[v].validation;
        return validations;
      }, {});

    joiSchema = joiSchema.keys(nestedValidations);
  }

  if(typeDescriptor.required) {
    joiSchema = joiSchema.required();
  }

  return joiSchema;
};
