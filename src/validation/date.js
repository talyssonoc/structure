const joi = require('joi');
const { mapToJoi } = require('./utils');

module.exports = {
  type: Date,
  joiMappings: [
    ['min', 'min', true],
    ['max', 'max', true],
    ['equal', 'only', true],
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    return mapToJoi(typeDescriptor, { initial: joi.date(), mappings: this.joiMappings });
  }
};
