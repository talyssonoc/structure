const joi = require('joi');

const { SCHEMA, VALIDATE } = require('../symbols');

const validations = [
  require('./string'),
  require('./number'),
  require('./boolean'),
  require('./date'),
];

const nestedValidation = require('./nested');
const arrayValidation = require('./array');

exports.validationForAttribute = function validationForAttribute(typeDescriptor) {
  if(typeDescriptor.itemType !== undefined) {
    return arrayValidation(typeDescriptor, typeDescriptor.itemType);
  }

  const validation = validations.find((v) => v.type === typeDescriptor.type);

  if(!validation) {
    return nestedValidation(typeDescriptor);
  }

  return validation.createJoiSchema(typeDescriptor);
};

const mapDetail = ({ message, path }) => ({ message, path });

const validatorOptions = {
  abortEarly: false,
  convert: false,
  allowUnknown: false
};

exports.validationForSchema = function validationForSchema(schema) {
  const schemaValidation = {};

  Object.keys(schema).forEach((attributeName) => {
    schemaValidation[attributeName] = schema[attributeName].validation;
  });

  const joiValidation = joi.object().keys(schemaValidation);

  return {
    validate(structure) {
      var validationErrors;

      const { error } = joiValidation.validate(structure, validatorOptions);

      if(error) {
        validationErrors = error.details.map(mapDetail);
      }

      return validationErrors;
    }
  };
};

exports.validationDescriptorForSchema = function validationDescriptorForSchema(schema) {
  const validation = schema[VALIDATE];

  return {
    value: function validate() {
      const serializedStructure = this.toJSON();

      return validateData(validation, serializedStructure);
    }
  };
};

exports.staticValidationDescriptorForSchema = function staticValidationDescriptorForSchema(schema) {
  const validation = schema[VALIDATE];

  return {
    value: function validate(data) {
      if(data[SCHEMA]) {
        data = data.toJSON();
      }

      return validateData(validation, data);
    }
  };
};

function validateData(validation, data) {
  const errors = validation.validate(data);

  if(errors) {
    return {
      valid: false,
      errors
    };
  }

  return { valid: true };
}
