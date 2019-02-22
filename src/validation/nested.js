const joi = require('joi');
const { SCHEMA } = require('../symbols');

module.exports = function nestedValidation(typeDescriptor) {
  if(typeDescriptor.dynamicType) {
    return validationToDynamicType(typeDescriptor);
  }

  const typeSchema = typeDescriptor.type[SCHEMA];
  return getNestedValidations(typeSchema);
};

function validationToDynamicType(typeDescriptor) {
  return joi.lazy(() => {
    const typeSchema = typeDescriptor.getType()[SCHEMA];

    return getNestedValidations(typeSchema);
  });
}

function getNestedValidations(typeSchema) {
  var joiSchema = joi.object();

  if(typeSchema) {
    const nestedValidations = Object.keys(typeSchema)
      .reduce((validations, v) => {
        validations[v] = typeSchema[v].validation;
        return validations;
      }, {});

    joiSchema = joiSchema.keys(nestedValidations);
  }


  return joiSchema;
}
