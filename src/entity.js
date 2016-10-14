const define = Object.defineProperty;
const createAttrs = () => Object.create(null);
const assignEachFromSchema = (schema, { src, dest }) => {
  Object.keys(schema).forEach((attr) => {
    dest[attr] = src[attr];
  });
};

function entity(declaredSchema, ErroneousPassedClass) {
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

        if('attributes' in instance) {
          return instance;
        }

        let attributes = createAttrs();

        define(instance, 'attributes', {
          get() {
            return attributes;
          },

          set(newAttributes) {
            attributes = createAttrs();

            assignEachFromSchema(schema, { src: newAttributes, dest: attributes });
          }
        });

        assignEachFromSchema(schema, { src: passedAttributes, dest: instance.attributes });

        return instance;
      }
    });

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

    define(WrapperClass, '__isEntity', {
      value: true
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

module.exports = entity;
