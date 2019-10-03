const joi = require('@hapi/joi');

const { IDENTIFIER } = require('../symbols');

const validations = [
  require('./string'),
  require('./number'),
  require('./boolean'),
  require('./date'),
];

const NestedValidation = require('./nested');
const arrayValidation = require('./array');

const {
  validationDescriptorForSchema,
  staticValidationDescriptorForSchema,
} = require('./descriptors');

exports.descriptorFor = validationDescriptorForSchema;
exports.staticDescriptorFor = staticValidationDescriptorForSchema;

exports.forAttribute = function validationForAttribute(typeDescriptor) {
  if (typeDescriptor.itemType !== undefined) {
    return arrayValidation(typeDescriptor, typeDescriptor.itemType);
  }

  const validation = validations.find((v) => v.type === typeDescriptor.type);

  if (!validation) {
    return NestedValidation.forType(typeDescriptor);
  }

  return validation.createJoiSchema(typeDescriptor);
};

const mapDetail = ({ message, path }) => ({ message, path });

const validatorOptions = {
  abortEarly: false,
  convert: false,
  allowUnknown: false,
};

exports.forSchema = function validationForSchema(schema) {
  const schemaValidation = {};

  Object.keys(schema).forEach((attributeName) => {
    schemaValidation[attributeName] = schema[attributeName].validation;
  });

  const joiValidation = joi
    .object()
    .keys(schemaValidation)
    .id(schema[IDENTIFIER]);

  return {
    joiValidation,
    validate(structure) {
      const validationWithDynamicLinks = NestedValidation.resolveDynamicLinks({
        schema,
        joiValidation,
      });

      const { error } = validationWithDynamicLinks.validate(structure, validatorOptions);

      if (error) {
        return error.details.map(mapDetail);
      }
    },
  };
};
