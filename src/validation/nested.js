const joi = require('joi');
const { SCHEMA } = require('../symbols');
const { requiredOption } = require('./utils');

module.exports = function nestedValidation(typeDescriptor) {
  if(typeDescriptor.dynamicType) {
    return validationToDynamicType(typeDescriptor);
  }

  const typeSchema = typeDescriptor.type[SCHEMA];
  var joiSchema = getNestedValidations(typeSchema);

  joiSchema = requiredOption(typeDescriptor, {
    initial: joiSchema
  });

  return joiSchema;
};

function validationToDynamicType(typeDescriptor) {
  var joiSchema = joi.lazy(() => {
    const typeSchema = typeDescriptor.getType()[SCHEMA];

    return getNestedValidations(typeSchema);
  });

  joiSchema = requiredOption(typeDescriptor, {
    initial: joiSchema
  });

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
