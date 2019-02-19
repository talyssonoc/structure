const { isFunction } = require('lodash');

const nativesInitializer = Object.assign({}, {
  getValue(attrDescriptor) {
    return attrDescriptor.default;
  },
  shouldInitialize(attrDescriptor) {
    return !isFunction(attrDescriptor.default);
  }
});

const derivedInitializer = Object.assign({}, {
  getValue(attrDescriptor, instance) {
    return attrDescriptor.default(instance);
  },
  shouldInitialize(attrDescriptor) {
    return isFunction(attrDescriptor.default);
  }
});

function initialize(attributes, schema, instance) {
  let initializedAttributes = {};

  initializedAttributes = initializeWith(nativesInitializer, attributes, schema, initializedAttributes);
  initializedAttributes = initializeWith(derivedInitializer, attributes, schema, initializedAttributes);

  return instance.attributes = initializedAttributes;
}

function initializeWith(initializer, attributes, schema, initializedAttributes) {
  for(let attrName in schema) {
    const value = attributes[attrName];

    if (value !== undefined) {
      continue;
    }

    if(initializer.shouldInitialize(schema[attrName])) {
      attributes[attrName] = initializer.getValue(schema[attrName], initializedAttributes);
    }
  }

  return attributes;
}

module.exports = { initialize, nativesInitializer, derivedInitializer };
