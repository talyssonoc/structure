const { isFunction } = require('lodash');

function isStaticInitialization(attrDescriptor) {
  return !isFunction(attrDescriptor.default);
}

function staticInitialization(attrDescriptor) {
  return attrDescriptor.default;
}

function derivedInitialization(attrDescriptor, instance) {
  return attrDescriptor.default(instance);
}

module.exports = function initializationOrderFor(schema) {
  const staticInitializations = [];
  const derivedInitializations = [];

  for (let attrName in schema) {
    const attributeDescriptor = schema[attrName];

    if (isStaticInitialization(attributeDescriptor)) {
      staticInitializations.push([attrName, staticInitialization]);
    } else {
      derivedInitializations.push([attrName, derivedInitialization]);
    }
  }

  return [...staticInitializations, ...derivedInitializations];
};
