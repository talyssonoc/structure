const joi = require('@hapi/joi');
const NestedValidation = require('./validations/nested');

const validatorOptions = {
  abortEarly: false,
  convert: false,
  allowUnknown: false,
};

module.exports = function validationForSchema(schema) {
  const schemaValidation = schema.attributeDefinitions.reduce(
    (schemaValidation, attributeDefinition) => ({
      ...schemaValidation,
      [attributeDefinition.name]: attributeDefinition.validation,
    }),
    {}
  );

  const joiValidation = joi
    .object()
    .keys(schemaValidation)
    .id(schema.identifier);

  return {
    joiValidation,
    validate(data) {
      const validationWithDynamicLinks = NestedValidation.resolveDynamicLinks({
        schema,
        joiValidation,
      });

      const { error } = validationWithDynamicLinks.validate(data, validatorOptions);

      if (error) {
        const errors = error.details.map(mapDetail);

        return {
          valid: false,
          errors,
        };
      }

      return { valid: true };
    },
  };
};

const mapDetail = ({ message, path }) => ({ message, path });
