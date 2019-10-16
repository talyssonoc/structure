const joi = require('@hapi/joi');
const { mapToJoi, mapToJoiWithReference, equalOption } = require('./utils');

module.exports = {
  type: Number,
  joiMappings: [
    ['integer', 'integer'],
    ['precision', 'precision', true],
    ['multiple', 'multiple', true],
    ['positive', 'positive', true],
    ['negative', 'negative', true],
  ],
  valueOrRefOptions: [['min', 'min'], ['greater', 'greater'], ['max', 'max'], ['less', 'less']],
  createJoiSchema(attributeDefinition) {
    let joiSchema = mapToJoiWithReference(attributeDefinition, {
      initial: joi.number(),
      mappings: this.valueOrRefOptions,
    });

    joiSchema = equalOption(attributeDefinition, { initial: joiSchema });

    return mapToJoi(attributeDefinition, {
      initial: joiSchema,
      mappings: this.joiMappings,
    });
  },
};
