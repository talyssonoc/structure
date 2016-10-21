const joi = require('joi');
const { mapToJoi, mapToJoiWithReference } = require('./utils');

module.exports = {
  type: Number,
  joiMappings: [
    ['integer', 'integer'],
    ['precision', 'precision', true],
    ['multiple', 'multiple', true],
    ['positive', 'positive', true],
    ['negative', 'negative', true],
    ['equal', 'only', true],
    ['required', 'required']
  ],
  numberOrRefOptions: [
    ['min', 'min'],
    ['greater', 'greater'],
    ['max', 'max'],
    ['less', 'less']
  ],
  createJoiSchema(typeDescriptor) {
    const joiSchema = mapToJoiWithReference(typeDescriptor, { initial: joi.number(), mappings: this.numberOrRefOptions });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
