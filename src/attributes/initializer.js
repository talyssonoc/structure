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
  instance.attributes = initializeWith(nativesInitializer, attributes, schema, instance);
  instance.attributes = initializeWith(derivedInitializer, attributes, schema, instance);

  return attributes;
}

function initializeWith(Initializer, attributes, schema, instance) {
  for(let attrName in schema) {
    const value = attributes[attrName];

    if(value === undefined && Initializer.shouldInitialize(schema[attrName])) {
      attributes[attrName] = Initializer.getValue(schema[attrName], instance);
    }
  }

  return attributes;
}



module.exports = { initialize, nativesInitializer, derivedInitializer };
