const { normalizeSchema } = require('./schemaNormalization');
const { serialize } = require('./serialization');
const { SCHEMA, ATTRIBUTES, VALIDATE } = require('./symbols');

const define = Object.defineProperty;
const createAttrs = () => Object.create(null);

function attributesDecorator(declaredSchema, ErroneousPassedClass) {
  if(ErroneousPassedClass) {
    const errorMessage = `You passed the entity class as the second parameter of entity(). The expected usage is \`entity(schema)(${ ErroneousPassedClass.name || 'EntityClass' })\`.`;

    throw new Error(errorMessage);
  }

  return function decorator(Class) {
    const WrapperClass = new Proxy(Class, {
      construct(target, constructorArgs, newTarget) {
        const instance = Reflect.construct(target, constructorArgs, newTarget);
        var passedAttributes = constructorArgs[0];

        if(passedAttributes === undefined) {
          passedAttributes = {};
        }

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
        enumerable: true,
        get() {
          return this.attributes[attr];
        },

        set(value) {
          this.attributes[attr] = declaredSchema[attr].coerce(value);
        }
      });
    });

    define(WrapperClass.prototype, 'isValid', validationDescriptor);

    return WrapperClass;
  };
}

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
    if(!newAttributes || typeof newAttributes !== 'object') {
      throw new Error('#attributes can\'t be set to a non-object.');
    }

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

const validationDescriptor = {
  value() {
    const validation = this[SCHEMA][VALIDATE];
    const serializedEntity = serialize(this);

    const errors = validation.validate(serializedEntity);

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

module.exports = attributesDecorator;
