const joi = require('joi');
const { mapToJoi, equalOption } = require('./utils');

module.exports = {
  type: Boolean,
  joiMappings: [
    ['required', 'required']
  ],
  createJoiSchema(typeDescriptor) {
    var joiSchema = joi.boolean();

    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

    return mapToJoi(typeDescriptor, { initial: joiSchema, mappings: this.joiMappings });
  }
};
