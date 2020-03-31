const Attributes = require('../attributes');

exports.for = function initializationForSchema(schema) {
  return {
    initialize(instance, { attributes }) {
      Attributes.setInInstance(instance, Object.create(null));

      for (let attrDefinition of schema.attributeDefinitions) {
        const attrPassedValue = attributes[attrDefinition.name];

        // will coerce through setters
        instance[attrDefinition.name] = attrDefinition.initialize(instance, attrPassedValue);
      }

      return instance;
    },
  };
};
