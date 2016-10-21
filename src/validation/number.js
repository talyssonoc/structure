const joi = require('joi');
const { mapToJoi } = require('./utils');

module.exports = {
  type: Number,
  joiMappings: [
    ['min', 'min', true],
    ['greater', 'greater', true],
    ['max', 'max', true],
    ['less', 'less', true],
    ['integer', 'integer'],
    ['precision', 'precision', true],
    ['multiple', 'multiple', true],
    ['positive', 'positive', true],
    ['negative', 'negative', true],
    ['equal', 'only', true],
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    return mapToJoi(typeDescriptor, joi.number(), this.joiMappings);
  }
};
