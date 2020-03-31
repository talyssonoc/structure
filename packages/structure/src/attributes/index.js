const { ATTRIBUTES } = require('../symbols');

exports.setInInstance = function setAttributesInInstance(instance, attributes) {
  Object.defineProperty(instance, ATTRIBUTES, {
    configurable: true,
    value: attributes,
  });
};
