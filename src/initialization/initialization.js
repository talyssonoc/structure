const { ATTRIBUTES } = require('../symbols');
const initializationOrderFor = require('./initializationOrder');

function initializedValue(
  attrPassedValue,
  attrInitializer,
  attrDescriptor,
  instance
) {
  if (attrPassedValue !== undefined) {
    return attrPassedValue;
  }

  return attrInitializer(attrDescriptor, instance);
}

module.exports = function forSchema(schema) {
  const initializationOrder = initializationOrderFor(schema);

  return {
    initialize(attributes, instance) {
      instance[ATTRIBUTES] = Object.create(null);

      for (let i = 0; i < initializationOrder.length; i++) {
        const [attrName, attrInitializer] = initializationOrder[i];
        const attrDescriptor = schema[attrName];
        const attrPassedValue = attributes[attrName];

        instance[attrName] = initializedValue(
          attrPassedValue,
          attrInitializer,
          attrDescriptor,
          instance
        );
      }
    },
  };
};
