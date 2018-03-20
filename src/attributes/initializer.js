const { isFunction } = require('lodash');

const natives = Object.assign({}, {
  getValue(attr) {
    return attr.default;
  },
  shouldInitialize(attr) {
    return !isFunction(attr.default);
  }
});

const functions = Object.assign({}, {
  getValue(attr, instance) {
    return attr.default(instance);
  },
  shouldInitialize(attr) {
    return isFunction(attr.default);
  }
});

function initialize(attributes, schema, instance, Initializer) {
  for(let attr in schema) {
    if (!Initializer.shouldInitialize(schema[attr])) {
      continue;
    }

    attributes[attr] = (
      attributes[attr] === undefined
      ? Initializer.getValue(schema[attr], instance)
      : attributes[attr]
    );
  }

  return attributes;
}

module.exports = { initialize, natives, functions };
