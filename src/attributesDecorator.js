const coerce = require('./typeCoercion');

const define = Object.defineProperty;

const createAttrs = () => Object.create(null);

const assignEachFromSchema = (schema, src, dest) => {
  Object.keys(schema).forEach((attr) => {
    dest[attr] = coerce(schema[attr], src[attr]);
  });
};

const attributesDescriptor = {
  get() {

    if(!this.__attributes) {
      const attributes = createAttrs();

      define(this, '__attributes', {
        configurable: true,
        value: attributes
      });
    }

    return this.__attributes;
  },

  set(newAttributes) {
    const attributes = createAttrs();
    const schema = this.constructor.__schema;

    assignEachFromSchema(schema, newAttributes, attributes);

    define(this, '__attributes', {
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
        const schema = newTarget.__schema;

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

    if('__schema' in WrapperClass) {
      declaredSchema = Object.assign({}, WrapperClass.__schema, declaredSchema);
    }

    define(WrapperClass, '__schema', {
      value: declaredSchema
    });

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
