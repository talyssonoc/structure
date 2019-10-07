const { isFunction, isString } = require('lodash');

class AttributeDefinition {
  static for(name, options) {
    options = makeComplete(options);

    return new this({
      name,
      options,
    });
  }

  static compare(definitionA, definitionB) {
    if (definitionA.dynamicDefault === definitionB.dynamicDefault) {
      return 0;
    }

    if (definitionA.dynamicDefault) {
      return 1;
    }

    return -1;
  }

  constructor({ name, options }) {
    this.name = name;
    this.options = options;
    this.dynamicDefault = isFunction(options.default);

    if (this.dynamicDefault) {
      this.initialize = options.default;
    } else {
      this.initialize = () => options.default;
    }
  }
}

const makeComplete = (options) => {
  if (!isShorthand(options)) {
    return options;
  }

  return { type: options };
};

const isShorthand = (options) => isFunction(options) || isString(options);

module.exports = AttributeDefinition;
