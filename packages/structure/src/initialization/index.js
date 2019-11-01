const { ATTRIBUTES } = require('../symbols');

exports.for = function initializationForSchema(schema) {
  return {
    initialize(instance, { attributes }) {
      Object.defineProperty(instance, ATTRIBUTES, {
        configurable: true,
        value: Object.create(null),
      });

      for (let i = 0; i < schema.attributeDefinitions.length; i++) {
        const attrDefinition = schema.attributeDefinitions[i];
        const attrPassedValue = attributes[attrDefinition.name];

        // will coerce through setters
        instance[attrDefinition.name] = attrDefinition.initialize(instance, attrPassedValue);
      }

      return instance;
    },
  };
};
