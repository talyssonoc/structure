const { isFunction, isString } = require('lodash');
const Coercion = require('../../coercion');

class AttributeDefinition {
  static for(name, options, schema) {
    options = makeComplete(options);

    return new this({
      name,
      options,
      schema,
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

  constructor({ name, options, schema }) {
    this.name = name;
    this.options = options;
    this.dynamicDefault = isFunction(options.default);
    this.hasDynamicType = isString(options.type);
    this.schema = schema;

    if (options.itemType) {
      this.isArrayType = true;
      this.itemTypeDefinition = AttributeDefinition.for('item', options.itemType, schema);
    }

    if (this.dynamicDefault) {
      this.initialize = options.default;
    } else {
      this.initialize = () => options.default;
    }

    this.coercion = Coercion.for(this);
  }

  resolveType() {
    if (this.hasDynamicType) {
      return this.schema.dynamicTypeFor(this.options.type);
    }

    return this.options.type;
  }

  coerce(newValue) {
    return this.coercion.coerce(newValue);
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
