const { SCHEMA, ATTRIBUTES, VALIDATE } = require('./symbols');
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
      throw new Error('#attributes can\'t be set to a non-object.');
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

exports.validationDescriptor = {
  value() {
    const validation = this[SCHEMA][VALIDATE];
    const serializedStructure = serialize(this);

    const errors = validation.validate(serializedStructure);

    if(errors) {
      define(this, 'errors', {
        value: errors,
        configurable: true
      });

      return false;
    }

    define(this, 'errors', {
      value: undefined,
      configurable: true
    });

    return true;
  }
};
