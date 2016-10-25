const joi = require('joi');

const validations = [
  require('./string'),
  require('./number'),
  require('./boolean'),
  require('./date'),
];

const nestedValidation = require('./nested');
const arrayValidation = require('./array');

function validationForAttribute(typeDescriptor) {
  if(typeDescriptor.items !== undefined) {
    return arrayValidation(typeDescriptor, typeDescriptor.items);
  }

  const validation = validations.find((v) => v.type === typeDescriptor.type);

  if(!validation) {
    return nestedValidation(typeDescriptor);
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

  return {
    joiValidation,
    validate(entity) {
      var validationErrors;

      const { error } = joiValidation.validate(entity, validatorOptions);

      if(error) {
        validationErrors = error.details.map(mapDetail);
      }

      return validationErrors;
    }
  };
}

exports.validationForAttribute = validationForAttribute;
exports.validationForSchema = validationForSchema;
