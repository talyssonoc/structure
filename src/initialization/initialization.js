const initializationOrderFor = require('./initializationOrder');

function getPassedAttrValue(attrName, attributes, instance) {
  if (instance[attrName] !== undefined) {
    return instance[attrName];
  }

  return attributes[attrName];
}

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
      for (let i = 0; i < initializationOrder.length; i++) {
        const [attrName, attrInitializer] = initializationOrder[i];
        const attrDescriptor = schema[attrName];
        const attrPassedValue = getPassedAttrValue(attrName, attributes, instance);

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
