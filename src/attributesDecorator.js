const normalizeSchema = require('./normalizeSchema');

const define = Object.defineProperty;
const createAttrs = () => Object.create(null);

const assignEachFromSchema = (schema, src, dest) => {
  Object.keys(schema).forEach((attr) => {
    dest[attr] = schema[attr].coerce(src[attr]);
  });
};

const SCHEMA = Symbol('schema');
const ATTRIBUTES = Symbol('attributes');

const attributesDescriptor = {
  get() {

    if(!this[ATTRIBUTES]) {
      const attributes = createAttrs();

      define(this, ATTRIBUTES, {
        configurable: true,
        value: attributes
      });
    }

    return this[ATTRIBUTES];
  },

  set(newAttributes) {
    const attributes = createAttrs();
    const schema = this[SCHEMA];

    assignEachFromSchema(schema, newAttributes, attributes);

    define(this, ATTRIBUTES, {
      configurable: true,
      value: attributes
    });
  }
};

function attributesDecorator(declaredSchema, ErroneousPassedClass) {
  if(ErroneousPassedClass) {
    const errorMessage = `You passed the entity class as the second parameter of entity(). The expected usage is \`entity(schema)(${ ErroneousPassedClass.name || 'EntityClass' })\`.`;

    throw new Error(errorMessage);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        const passedAttributes = constructorArgs[0];
        const schema = newTarget[SCHEMA];

        assignEachFromSchema(schema, passedAttributes, instance.attributes);

        return instance;
      }
    });

    define(WrapperClass.prototype, 'attributes', attributesDescriptor);

    Object.keys(declaredSchema).forEach((attr) => {
      define(WrapperClass.prototype, attr, {
        get() {
          return this.attributes[attr];
        },

        set(value) {
          this.attributes[attr] = value;
        }
      });
    });

    if(SCHEMA in WrapperClass) {
      declaredSchema = Object.assign({}, WrapperClass[SCHEMA], declaredSchema);
    }

    declaredSchema = normalizeSchema(declaredSchema);

    define(WrapperClass, SCHEMA, {
      value: declaredSchema
    });

    define(WrapperClass.prototype, SCHEMA, {
      value: declaredSchema
    });

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
