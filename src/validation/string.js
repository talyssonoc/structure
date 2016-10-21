const joi = require('joi');
const { mapToJoi } = require('./utils');

module.exports = {
  type: String,
  joiMappings: [
    ['equal', 'only', true],
    ['minLength', 'min', true],
    ['maxLength', 'max', true],
    ['exactLength', 'length', true],
    ['regex', 'regex', true],
    ['alphanumeric', 'alphanum'],
    ['lowerCase', 'lowercase'],
    ['upperCase', 'uppercase'],
    ['email', 'email'],
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = joi.string();

    if(typeDescriptor.empty) {
      joiSchema = joiSchema.allow('');
    }

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
