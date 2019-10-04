const { ATTRIBUTES } = require('../symbols');
const initializationOrderForSchema = require('./initializationOrderForSchema');

exports.for = function initializationForSchema(schema) {
  const initializationOrder = initializationOrderForSchema(schema);

  return {
    initialize(instance, { attributes }) {
      Object.defineProperty(instance, ATTRIBUTES, {
        value: Object.create(null),
      });

      for (let i = 0; i < initializationOrder.length; i++) {
        const [attrName, attrInitializer] = initializationOrder[i];
        const attrDescriptor = schema.attributeDescriptors[attrName];
        const attrPassedValue = attributes[attrName];

        // will coerce through setters
        instance[attrName] = initializedValue(
          instance,
          attrPassedValue,
          attrInitializer,
          attrDescriptor
        );
      }

      return instance;
    },
  };
};

const initializedValue = (instance, attrPassedValue, attrInitializer, attrDescriptor) => {
  if (attrPassedValue !== undefined) {
    return attrPassedValue;
  }

  return attrInitializer(attrDescriptor, instance);
};
