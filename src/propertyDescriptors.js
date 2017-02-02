const { SCHEMA, ATTRIBUTES } = require('./symbols');
const Errors = require('./errors');
const { serialize } = require('./serialization');

const createAttrs = () => Object.create(null);
const define = Object.defineProperty;
const OBJECT_TYPE = 'object';

exports.attributesDescriptor = {
  get() {
    return this[ATTRIBUTES];
  },

  set(newAttributes) {
    if(!newAttributes || typeof newAttributes !== OBJECT_TYPE) {
      throw Errors.nonObjectAttributes();
    }

    const attributes = createAttrs();
    const schema = this[SCHEMA];

    for(let attrName in schema) {
      attributes[attrName] = schema[attrName].coerce(newAttributes[attrName]);
    }

    define(this, ATTRIBUTES, {
      configurable: true,
      value: attributes
    });
  }
};

exports.serializationDescriptor = {
  value: function toJSON() {
    return serialize(this);
  }
};
