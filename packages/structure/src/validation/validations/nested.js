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

const resolveDynamicLinks = function resolveDynamicLinks({ schema, joiValidation }) {
  return schema.attributeDefinitions.reduce((joiValidation, attributeDefinition) => {
    if (!attributeDefinition.hasDynamicType) {
      return joiValidation;
    }

    const type = attributeDefinition.resolveType();
    const nestedSchema = type[SCHEMA];

    // warning: uses Joi internals
    // https://github.com/hapijs/joi/blob/v16.1.8/lib/types/any.js#L72 ⤵
    // https://github.com/hapijs/joi/blob/v16.1.8/lib/base.js#L699 ⤵
    // https://github.com/hapijs/joi/blob/v16.1.8/lib/modify.js#L149
    if (!nestedSchema || joiValidation._ids._get(nestedSchema.identifier)) {
      return joiValidation;
    }

    const attributeValidation = nestedSchema.validation;

    const sharedValidation = joiValidation.shared(attributeValidation.joiValidation);

    return resolveDynamicLinks({
      schema: nestedSchema,
      joiValidation: sharedValidation,
    });
  }, joiValidation);
};

exports.resolveDynamicLinks = resolveDynamicLinks;
