const Errors = require('../errors');
const { ATTRIBUTES } = require('../symbols');

const OBJECT_TYPE = 'object';

exports.attributeDescriptorFor = function attributeDescriptorFor(attributeName, schema) {
  return {
    enumerable: true,
    get() {
      return this.attributes[attributeName];
    },

    set(value) {
      this.attributes[attributeName] = schema[attributeName].coerce(value);
    }
  };
};

exports.attributesDescriptorFor = function attributesDescriptorFor(schema) {
  return {
    get() {
      return this[ATTRIBUTES];
    },

    set(newAttributes) {
      if(!newAttributes || typeof newAttributes !== OBJECT_TYPE) {
        throw Errors.nonObjectAttributes();
      }

      const attributes = Object.create(null);

      for(let attrName in schema) {
        attributes[attrName] = schema[attrName].coerce(newAttributes[attrName]);
      }

      Object.defineProperty(this, ATTRIBUTES, {
        configurable: true,
        value: attributes
      });
    }
  };
};
