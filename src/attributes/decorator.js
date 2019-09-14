const Schema = require('../schema');
const Serialization = require('../serialization');
const Validation = require('../validation');
const Initialization = require('../initialization');
const StrictMode = require('../strictMode');
const Errors = require('../errors');
const { SCHEMA } = require('../symbols');
const {
  attributeDescriptorFor,
  attributesDescriptorFor,
} = require('./descriptors');
const Cloning = require('../cloning');

const define = Object.defineProperty;

function attributesDecorator(schema, schemaOptions = {}) {
  if (typeof schemaOptions !== 'object') {
    throw Errors.classAsSecondParam(schemaOptions);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        const passedAttributes = Object.assign({}, constructorArgs[0]);

        Initialization.initialize(schema, passedAttributes, instance);

        return instance;
      },
    });

    if (WrapperClass[SCHEMA]) {
      schema = Object.assign({}, WrapperClass[SCHEMA], schema);
    }

    schema = Schema.normalize(schema, schemaOptions);

    define(WrapperClass, SCHEMA, {
      value: schema,
    });

    define(WrapperClass, 'validate', Validation.staticDescriptorFor(schema));

    define(WrapperClass.prototype, SCHEMA, {
      value: schema,
    });

    define(WrapperClass.prototype, 'attributes', attributesDescriptorFor(
      schema
    ));

    define(WrapperClass.prototype, 'validate', Validation.descriptorFor(
      schema
    ));

    define(WrapperClass.prototype, 'toJSON', Serialization.descriptor);

    define(WrapperClass, 'buildStrict', StrictMode.buildStrictDescriptorFor(
      WrapperClass,
      schemaOptions
    ));

    define(WrapperClass.prototype, 'clone', Cloning.buildCloneDescriptorFor(
      WrapperClass
    ));

    Object.keys(schema).forEach((attr) => {
      define(WrapperClass.prototype, attr, attributeDescriptorFor(
        attr,
        schema
      ));
    });

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
