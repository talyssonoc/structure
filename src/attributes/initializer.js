const { isFunction } = require('lodash');

const natives = Object.assign({}, {
  getValue(attrDescriptor) {
    return attrDescriptor.default;
  },
  shouldInitialize(attrDescriptor) {
    return !isFunction(attrDescriptor.default);
  }
});

const functions = Object.assign({}, {
  getValue(attrDescriptor, instance) {
    return attrDescriptor.default(instance);
  },
  shouldInitialize(attrDescriptor) {
    return isFunction(attrDescriptor.default);
  }
});

function initialize(attributes, schema, instance, Initializer) {
  for(let attrName in schema) {
    initializeAttribute(attributes, attrName, schema, instance, Initializer);
  }

  return attributes;
}

function initializeAttribute(attributes, attrName, schema, instance, Initializer) {
  if (!Initializer.shouldInitialize(schema[attrName])) {
    return;
  }

  attributes[attrName] = getInitialValue(
    attributes[attrName],
    attrName,
    schema,
    instance,
    Initializer
  );
}

function getInitialValue(value, attrName, schema, instance, Initializer) {
  if(value === undefined) {
    return Initializer.getValue(schema[attrName], instance);
  }

  return value;
}

module.exports = { initialize, natives, functions };
