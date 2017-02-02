const Schema = require('../schema');
const getInitialValues = require('./initialValuesCreation');
const { SCHEMA } = require('../symbols');
const {
  attributesDescriptor,
  serializationDescriptor
} = require('../propertyDescriptors');

const {
  validationDescriptorForSchema,
  staticValidationDescriptorForSchema
} = require('../validation');

const Errors = require('../errors');

const define = Object.defineProperty;

function attributesDecorator(schema, schemaOptions = {}) {
  if(typeof schemaOptions !== 'object') {
    throw Errors.classAsSecondParam(schemaOptions);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        const passedAttributes = constructorArgs[0] || {};

        instance.attributes = getInitialValues(passedAttributes, schema, instance);

        return instance;
      }
    });

    schema = Schema.normalize(schema, schemaOptions);

    if(WrapperClass[SCHEMA]) {
      schema = Object.assign({}, WrapperClass[SCHEMA], schema);
    }

    define(WrapperClass, SCHEMA, {
      value: schema
    });

    define(WrapperClass, 'validate', staticValidationDescriptorForSchema(schema));

    define(WrapperClass.prototype, SCHEMA, {
      value: schema
    });

    define(WrapperClass.prototype, 'attributes', attributesDescriptor);

    Object.keys(schema).forEach((attr) => {
      define(WrapperClass.prototype, attr, {
        enumerable: true,
        get() {
          return this.attributes[attr];
        },

        set(value) {
          this.attributes[attr] = schema[attr].coerce(value);
        }
      });
    });

    define(WrapperClass.prototype, 'validate', validationDescriptorForSchema(schema));

    define(WrapperClass.prototype, 'toJSON', serializationDescriptor);

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
