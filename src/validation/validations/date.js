const joi = require('@hapi/joi');
const { mapToJoi, mapToJoiWithReference, equalOption } = require('./utils');

module.exports = {
  type: Date,
  joiMappings: [],
  valueOrRefOptions: [['min', 'min'], ['max', 'max']],
  createJoiSchema(attributeDefinition) {
    let joiSchema = mapToJoiWithReference(attributeDefinition, {
      initial: joi.date(),
      mappings: this.valueOrRefOptions,
    });

    joiSchema = equalOption(attributeDefinition, { initial: joiSchema });

    return mapToJoi(attributeDefinition, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
