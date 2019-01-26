const joi = require('joi');
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
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = joi.string();

    if(typeDescriptor.nullable) {
      joiSchema = joiSchema.allow(null);
    }

    if(typeDescriptor.empty) {
      joiSchema = joiSchema.allow('');
    }

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
