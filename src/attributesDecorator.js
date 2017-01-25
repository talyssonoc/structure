const { normalizeSchema } = require('./schemaNormalization');
const { getInitialValues } = require('./initialValueCreation');
const { SCHEMA } = require('./symbols');
const {
  attributesDescriptor,
  serializationDescriptor
} = require('./propertyDescriptors');

const {
  validationDescriptorForSchema,
  staticValidationDescriptorForSchema
} = require('./validation');

const define = Object.defineProperty;

function attributesDecorator(declaredSchema) {
  if(arguments.length > 1) {
    const ErroneousPassedClass = arguments[1];

    const errorMessage = `You passed the structure class as the second parameter of attributes(). The expected usage is \`attributes(schema)(${ ErroneousPassedClass.name || 'StructureClass' })\`.`;

    throw new Error(errorMessage);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        const passedAttributes = constructorArgs[0] || {};

        instance.attributes = getInitialValues(passedAttributes, declaredSchema, instance);

        return instance;
      }
    });

    declaredSchema = normalizeSchema(declaredSchema);

    if(WrapperClass[SCHEMA]) {
      declaredSchema = Object.assign({}, WrapperClass[SCHEMA], declaredSchema);
    }

    define(WrapperClass, SCHEMA, {
      value: declaredSchema
    });

    define(WrapperClass, 'validate', staticValidationDescriptorForSchema(declaredSchema));

    define(WrapperClass.prototype, SCHEMA, {
      value: declaredSchema
    });

    define(WrapperClass.prototype, 'attributes', attributesDescriptor);

    Object.keys(declaredSchema).forEach((attr) => {
      define(WrapperClass.prototype, attr, {
        enumerable: true,
        get() {
          return this.attributes[attr];
        },

        set(value) {
          this.attributes[attr] = declaredSchema[attr].coerce(value);
        }
      });
    });

    define(WrapperClass.prototype, 'validate', validationDescriptorForSchema(declaredSchema));

    define(WrapperClass.prototype, 'toJSON', serializationDescriptor);

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
