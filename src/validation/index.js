const joi = require('joi');

const validations = [
  require('./string'),
  require('./number')
];

function validationForAttribute(typeDescriptor) {
  const validation = validations.find((v) => v.type === typeDescriptor.type);

  if(!validation) {
    return joi.any();
  }

  return validation.createJoiSchema(typeDescriptor);
}

const mapDetail = ({ message, path }) => ({ message, path });

const validatorOptions = {
  abortEarly: false,
  convert: false,
  allowUnknown: false
};

function validationForSchema(schema) {
  const schemaValidation = {};

  Object.keys(schema).forEach((attributeName) => {
    schemaValidation[attributeName] = schema[attributeName].validation;
  });

  const joiValidation = joi.object().keys(schemaValidation);

  return function validate(entity) {
    var validationErrors;

    const { error } = joiValidation.validate(entity, validatorOptions);

    if(error) {
      validationErrors = error.details.map(mapDetail);
    }

    return validationErrors;
  };
}

exports.validationForAttribute = validationForAttribute;
exports.validationForSchema = validationForSchema;
