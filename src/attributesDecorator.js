const normalizeSchema = require('./normalizeSchema');

const define = Object.defineProperty;
const createAttrs = () => Object.create(null);


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
    const attrNames = Object.keys(schema);

    for(let i = 0; i < attrNames.length; i++) {
      attributes[attrNames[i]] = schema[attrNames[i]].coerce(newAttributes[attrNames[i]]);
    }

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

        instance.attributes = passedAttributes;

        return instance;
      }
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

    return WrapperClass;
  };
}

module.exports = attributesDecorator;
