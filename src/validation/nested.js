const joi = require('joi');
const { SCHEMA } = require('../symbols');

module.exports = function nestedValidation(typeDescriptor) {
  if(typeDescriptor.dynamicType) {
    return validationToDynamicType(typeDescriptor);
  }

  const typeSchema = typeDescriptor.type[SCHEMA];
  var joiSchema = getNestedValidations(typeSchema);

  if(typeDescriptor.required) {
    joiSchema = joiSchema.required();
  }

  return joiSchema;
};

function validationToDynamicType(typeDescriptor) {
  var joiSchema = joi.lazy(() => {
    const typeSchema = typeDescriptor.getType()[SCHEMA];

    return getNestedValidations(typeSchema);
  });

  if(typeDescriptor.required) {
    joiSchema = joiSchema.required();
  }

  return joiSchema;
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
