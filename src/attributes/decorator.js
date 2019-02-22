const Schema = require('../schema');
const Serialization = require('../serialization');
const Validation = require('../validation');
const Errors = require('../errors');
const { SCHEMA } = require('../symbols');
const Initializer = require('./initializer');
const {
  attributeDescriptorFor,
  attributesDescriptorFor
} = require('./descriptors');

const define = Object.defineProperty;

function attributesDecorator(schema, schemaOptions = {}) {
  if(typeof schemaOptions !== 'object') {
    throw Errors.classAsSecondParam(schemaOptions);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        const passedAttributes = Object.assign({}, constructorArgs[0]);

        Initializer.initialize(passedAttributes, schema, instance);

        return instance;
      }
    });

    if(WrapperClass[SCHEMA]) {
      schema = Object.assign({}, WrapperClass[SCHEMA], schema);
    }

    schema = Schema.normalize(schema, schemaOptions);

    define(WrapperClass, SCHEMA, {
      value: schema
    });

    define(WrapperClass, 'validate', Validation.staticDescriptorFor(schema));

    define(WrapperClass.prototype, SCHEMA, {
      value: schema
    });

    define(WrapperClass.prototype, 'attributes', attributesDescriptorFor(schema));

    Object.keys(schema).forEach((attr) => {
      define(WrapperClass.prototype, attr, attributeDescriptorFor(attr, schema));
    });

    define(WrapperClass.prototype, 'validate', Validation.descriptorFor(schema));

    define(WrapperClass.prototype, 'toJSON', Serialization.descriptor);

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
