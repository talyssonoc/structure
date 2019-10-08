const joi = require('@hapi/joi');
const { isPlainObject } = require('lodash');
const { mapToJoi, equalOption } = require('./utils');

module.exports = {
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
    ['guid', 'guid', isPlainObject],
  ],
  createJoiSchema(typeDescriptor) {
    let joiSchema = joi.string();

    if (typeDescriptor.empty) {
      joiSchema = joiSchema.allow('');
    }

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
