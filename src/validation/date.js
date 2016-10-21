const joi = require('joi');
const { mapToJoi } = require('./utils');

module.exports = {
  type: Date,
  joiMappings: [
    ['min', 'min', true],
    ['max', 'max', true],
    ['equal', 'valid', true],
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    return mapToJoi(typeDescriptor, joi.date(), this.joiMappings);
  }
};
