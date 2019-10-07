const { isFunction, isString } = require('lodash');

class AttributeDefinition {
  static for(name, options) {
    options = makeComplete(options);

    return new this({
      name,
      options,
    });
  }

  constructor({ name, options }) {
    this.name = name;
    this.options = options;
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
