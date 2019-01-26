const joi = require('joi');
const { mapToJoi, equalOption } = require('./utils');

module.exports = {
  type: Boolean,
  joiMappings: [
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = joi.boolean();

    if(typeDescriptor.nullable) {
      joiSchema = joiSchema.allow(null);
    }

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
