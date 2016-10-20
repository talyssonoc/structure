const joi = require('joi');

function mapToJoi (typeDescriptor, initialJoiSchema, joiMappings) {
  return joiMappings.reduce((joiSchema, [optionName, joiMethod, passValueToJoi]) => {
    if(typeDescriptor[optionName]) {
      if(passValueToJoi) {
        return joiSchema[joiMethod](typeDescriptor[optionName]);
      }
      return joiSchema[joiMethod]();
    }

    return joiSchema;
  }, initialJoiSchema);
}

const validations = [
  {
    type: String,
    joiMappings: [
      ['minLength', 'min', true],
      ['maxLength', 'max', true],
      ['exactLength', 'length', true],
      ['regex', 'regex', true],
      ['alphanumeric', 'alphanum'],
      ['lowerCase', 'lowercase'],
      ['upperCase', 'uppercase'],
      ['email', 'email'],
      ['required', 'required'],
    ],
    createJoiSchema(typeDescriptor) {
      return mapToJoi(typeDescriptor, joi.string(), this.joiMappings);
    }
  }
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
  convert: false
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
