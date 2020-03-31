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
  createJoiSchema(attributeDefinition) {
    let joiSchema = joi.string();

    if (attributeDefinition.options.empty) {
      joiSchema = joiSchema.allow('');
    }

    joiSchema = equalOption(attributeDefinition, { initial: joiSchema });

    return mapToJoi(attributeDefinition, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
