const { isFunction, isString } = require('lodash');

class AttributeDescriptor {
  static for(name, rawDefinition) {
    const definition = makeComplete(rawDefinition);

    return new this({
      name,
      definition,
    });
  }

  constructor({ name, definition }) {
    this.name = name;
    this.definition = definition;
  }
}

const makeComplete = (definition) => {
  if (!isShorthand(definition)) {
    return definition;
  }

  return { type: definition };
};

const isShorthand = (definition) => isFunction(definition) || isString(definition);

module.exports = AttributeDescriptor;
