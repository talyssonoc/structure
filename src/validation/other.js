const joi = require('joi');
const { SCHEMA, VALIDATE } = require('../symbols');

module.exports = function otherValidation(typeDescriptor) {
  var joiSchema = joi.object().type(typeDescriptor.type);
  var typeSchema = typeDescriptor.type[SCHEMA];

  if(typeSchema !== undefined) {
    var nestedValidations = {};
    var nestedValuesNames = Object.keys(typeSchema);

    nestedValuesNames.forEach((v) => {
      nestedValidations[v] = typeSchema[v].validation;
    });

    joiSchema = joiSchema.keys(nestedValidations);
  }

  if(typeDescriptor.required) {
    joiSchema = joiSchema.required();
  }

  return joiSchema;
}
