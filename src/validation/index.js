const joi = require('joi');

const validations = [
  require('./string'),
  require('./number'),
  require('./boolean'),
  require('./date'),
];

const nestedValidation = require('./nested');
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
    return nestedValidation(typeDescriptor);
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

  const joiValidation = joi.object().keys(schemaValidation);

  return {
    validate(structure) {
      var validationErrors;

      const { error } = joiValidation.validate(structure, validatorOptions);

      if (error) {
        validationErrors = error.details.map(mapDetail);
      }

      return validationErrors;
    },
  };
};
