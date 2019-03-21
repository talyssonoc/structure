const { ATTRIBUTES } = require('../symbols');
const initializationOrderFor = require('./initializationOrder');

module.exports = function forSchema(schema) {
  const initializationOrder = initializationOrderFor(schema);

  return {
    initialize(attributes, instance) {
      instance[ATTRIBUTES] = Object.create(null);

      for(let i = 0; i < initializationOrder.length; i++) {
        const [ attrName, attrInitializer ] = initializationOrder[i];
        const attrDescriptor = schema[attrName];
        const attrPassedValue = attributes[attrName];

        if(attrPassedValue !== undefined) {
          instance[attrName] = attrPassedValue;
        } else {
          instance[attrName] = attrInitializer(attrDescriptor, instance);
        }
      }
    }
  };
};
