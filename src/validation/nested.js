const joi = require('@hapi/joi');
const { SCHEMA, VALIDATE } = require('../symbols');
const { requiredOption } = require('./utils');

exports.forType = function nestedValidationForType(typeDescriptor) {
  if (typeDescriptor.dynamicType) {
    return validationToDynamicType(typeDescriptor);
  }

  const typeSchema = typeDescriptor.type[SCHEMA];
  let joiSchema = getNestedValidations(typeSchema);

  joiSchema = requiredOption(typeDescriptor, {
    initial: joiSchema,
  });

  return joiSchema;
};

function validationToDynamicType(typeDescriptor) {
  let joiSchema = joi.link(`#${typeDescriptor.type}`);

  joiSchema = requiredOption(typeDescriptor, {
    initial: joiSchema,
  });

  return joiSchema;
}

function getNestedValidations(typeSchema) {
  let joiSchema = joi.object();

  if (typeSchema) {
    const nestedValidations = Object.keys(typeSchema).reduce((validations, v) => {
      validations[v] = typeSchema[v].validation;
      return validations;
    }, {});

    joiSchema = joiSchema.keys(nestedValidations);
  }

  return joiSchema;
}

exports.resolveDynamicLinks = function resolveDynamicLinks({ schema, joiValidation }) {
  return Object.keys(schema).reduce((joiValidation, attributeName) => {
    const attributeDescriptor = schema[attributeName];

    if (!attributeDescriptor.dynamicType) {
      return joiValidation;
    }

    const type = attributeDescriptor.getType();

    if (!type[SCHEMA]) {
      return joiValidation;
    }

    const attributeValidation = type[SCHEMA][VALIDATE];

    return joiValidation.shared(attributeValidation.joiValidation);
  }, joiValidation);
};
