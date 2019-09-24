const joi = require('@hapi/joi');
const { mapToJoi, equalOption } = require('./utils');

module.exports = {
  type: Boolean,
  joiMappings: [],
  createJoiSchema(typeDescriptor) {
    let joiSchema = equalOption(typeDescriptor, { initial: joi.boolean() });

    return mapToJoi(typeDescriptor, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
