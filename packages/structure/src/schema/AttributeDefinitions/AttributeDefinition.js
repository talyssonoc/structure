const { isFunction, isString, isUndefined } = require('lodash');
const Coercion = require('../../coercion');
const Validation = require('../../validation');
const Errors = require('../../errors');
const { SCHEMA } = require('../../symbols');

class AttributeDefinition {
  static for(name, options, schema) {
    if (options.__isAttributeDefinition) {
      return new this({
        name,
        options: options.options,
        schema,
      });
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
    if (definitionA.isDynamicDefault === definitionB.isDynamicDefault) {
      return 0;
    }

    if (definitionA.isDynamicDefault) {
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
    options = this.options = applyDefaultOptions(options, schema);
    this.hasDefault = 'default' in options;
    this.isDynamicDefault = isFunction(options.default);
    this.hasDynamicType = hasDynamicType(options);
    this.schema = schema;

    if (options.itemType) {
      this.isArrayType = true;
      this.itemTypeDefinition = AttributeDefinition.for('item', options.itemType, schema);
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

  initialize(instance, attributeValue) {
    if (this.shouldInitializeToDefault(attributeValue)) {
      return this.defaultValueFor(instance);
    }

    return attributeValue;
  }

  defaultValueFor(instance) {
    if (this.isDynamicDefault) {
      return this.options.default(instance);
    }

    return this.options.default;
  }

  shouldInitializeToDefault(attributeValue) {
    const isUndefined = attributeValue === undefined;
    const isDefaultableNull = !this.options.nullable && attributeValue === null;

    return this.hasDefault && (isUndefined || isDefaultableNull);
  }
}

const makeComplete = (options) => {
  if (!isShorthand(options)) {
    return options;
  }

  return { type: options };
};

const applyDefaultOptions = (options, schema) => {
  return {
    ...options,
    coercion: inheritOptionFromSchema(options.coercion, schema.options.coercion),
  };
};

const inheritOptionFromSchema = (option, schemaOption) =>
  !isUndefined(option) ? option : schemaOption;

const isShorthand = (options) => isFunction(options) || isString(options);

const hasStaticType = (options) => isFunction(options.type);
const hasDynamicType = (options) => isString(options.type);

module.exports = AttributeDefinition;
