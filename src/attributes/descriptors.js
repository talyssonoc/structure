const { isObject } = require('lodash');
const Errors = require('../errors');
const { ATTRIBUTES } = require('../symbols');

exports.attributeDescriptorFor = function attributeDescriptorFor(attributeName, schema) {
  return {
    enumerable: true,
    get() {
      return this.attributes[attributeName];
    },

    set(value) {
      this.attributes[attributeName] = schema[attributeName].coerce(value, schema[attributeName].nullable);
    }
  };
};

exports.attributesDescriptorFor = function attributesDescriptorFor(schema) {
  return {
    get() {
      return this[ATTRIBUTES];
    },

    set(newAttributes) {
      if(!isObject(newAttributes)) {
        throw Errors.nonObjectAttributes();
      }

      const attributes = coerceAttributes(newAttributes, schema);

      Object.defineProperty(this, ATTRIBUTES, {
        configurable: true,
        value: attributes
      });
    }
  };
};

function coerceAttributes(newAttributes, schema) {
  const attributes = Object.create(null);

  for(let attrName in schema) {
    attributes[attrName] = schema[attrName].coerce(newAttributes[attrName], schema[attrName].nullable);
  }

  return attributes;
}
