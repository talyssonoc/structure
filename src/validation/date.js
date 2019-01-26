const joi = require('joi');
const { mapToJoi, mapToJoiWithReference, equalOption } = require('./utils');

module.exports = {
  type: Date,
  joiMappings: [
    ['required', 'required']
  ],
  valueOrRefOptions: [
    ['min', 'min'],
    ['max', 'max'],
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = mapToJoiWithReference(typeDescriptor, {
      initial: joi.date(),
      mappings: this.valueOrRefOptions
    });

    if(typeDescriptor.nullable) {
      joiSchema = joiSchema.allow(null);
    }

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
