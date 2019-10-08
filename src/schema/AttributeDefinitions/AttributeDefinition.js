const { isFunction, isString } = require('lodash');
const Coercion = require('../../coercion');
const Validation = require('../../validation');
const Errors = require('../../errors');
const { SCHEMA } = require('../../symbols');

class AttributeDefinition {
  static for(name, options, schema) {
    if (options.__isAttributeDefinition) {
      return options;
    }

    options = makeComplete(options);

    this.assertValidType(name, options);
    this.assertDynamicExists(name, options, schema);

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

  static assertDynamicExists(name, options, schema) {
    if (!hasDynamicType(options)) {
      return;
    }

    if (!schema.hasDynamicTypeFor(options.type)) {
      throw Errors.missingDynamicType(name);
    }
  }

  static assertValidType(name, options) {
    if (hasDynamicType(options) || hasStaticType(options)) {
      return;
    }

    throw Errors.invalidType(name);
  }

  constructor({ name, options, schema }) {
    // used to extend schemas when subclassing structures
    this.__isAttributeDefinition = true;

    this.name = name;
    this.options = options;
    this.dynamicDefault = isFunction(options.default);
    this.hasDynamicType = hasDynamicType(options);
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
    this.validation = Validation.forAttribute(this);
  }

  resolveType() {
    if (this.hasDynamicType) {
      return this.schema.dynamicTypeFor(this.options.type);
    }

    return this.options.type;
  }

  get isNestedSchema() {
    return Boolean(this.resolveType()[SCHEMA]);
  }

  get itemsAreStructures() {
    return this.isArrayType && this.itemTypeDefinition.isNestedSchema;
  }

  coerce(newValue) {
    return this.coercion.coerce(newValue);
  }

  shouldSerialize(attributeValue) {
    return this.isValuePresent(attributeValue) || this.isValueNullable(attributeValue);
  }

  isValuePresent(attributeValue) {
    return attributeValue != null;
  }

  isValueNullable(attributeValue) {
    return attributeValue !== undefined && this.options.nullable;
  }
}

const makeComplete = (options) => {
  if (!isShorthand(options)) {
    return options;
  }

  return { type: options };
};

const isShorthand = (options) => isFunction(options) || isString(options);

const hasStaticType = (options) => isFunction(options.type);
const hasDynamicType = (options) => isString(options.type);

module.exports = AttributeDefinition;
