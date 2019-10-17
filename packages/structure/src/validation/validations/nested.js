const joi = require('@hapi/joi');
const { SCHEMA } = require('../../symbols');
const { requiredOption } = require('./utils');

exports.forType = function nestedValidationForType(attributeDefinition) {
  if (attributeDefinition.hasDynamicType) {
    return validationToDynamicType(attributeDefinition);
  }

  const typeSchema = attributeDefinition.resolveType()[SCHEMA];
  let joiSchema = getNestedValidations(typeSchema);

  joiSchema = requiredOption(attributeDefinition, {
    initial: joiSchema,
  });

  return joiSchema;
};

function validationToDynamicType(attributeDefinition) {
  let joiSchema = joi.link(`#${attributeDefinition.options.type}`);

  joiSchema = requiredOption(attributeDefinition, {
    initial: joiSchema,
  });

  return joiSchema;
}

function getNestedValidations(typeSchema) {
  let joiSchema = joi.object();

  if (typeSchema) {
    const nestedValidations = typeSchema.attributeDefinitions.reduce(
      (validations, attributeDefinition) => ({
        ...validations,
        [attributeDefinition.name]: attributeDefinition.validation,
      }),
      {}
    );

    joiSchema = joiSchema.keys(nestedValidations);
  }

  return joiSchema;
}

exports.resolveDynamicLinks = function resolveDynamicLinks({ schema, joiValidation }) {
  return schema.attributeDefinitions.reduce((joiValidation, attributeDefinition) => {
    if (!attributeDefinition.hasDynamicType) {
      return joiValidation;
    }

    const type = attributeDefinition.resolveType();

    if (!type[SCHEMA]) {
      return joiValidation;
    }

    const attributeValidation = type[SCHEMA].validation;

    return joiValidation.shared(attributeValidation.joiValidation);
  }, joiValidation);
};
