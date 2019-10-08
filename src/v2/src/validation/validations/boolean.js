const joi = require('@hapi/joi');
const { mapToJoi, equalOption } = require('./utils');

module.exports = {
  type: Boolean,
  joiMappings: [],
  createJoiSchema(attributeDefinition) {
    let joiSchema = equalOption(attributeDefinition, { initial: joi.boolean() });

    return mapToJoi(attributeDefinition, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
