const joi = require('joi');
const { mapToJoi, mapToJoiWithReference, equalOption } = require('./utils');

module.exports = {
  type: Number,
  joiMappings: [
    ['integer', 'integer'],
    ['precision', 'precision', true],
    ['multiple', 'multiple', true],
    ['positive', 'positive', true],
    ['negative', 'negative', true],
    ['required', 'required']
  ],
  valueOrRefOptions: [
    ['min', 'min'],
    ['greater', 'greater'],
    ['max', 'max'],
    ['less', 'less']
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = mapToJoiWithReference(typeDescriptor, {
      initial: joi.number(),
      mappings: this.valueOrRefOptions
    });

    if(typeDescriptor.nullable) {
      joiSchema = joiSchema.allow(null);
    }

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
