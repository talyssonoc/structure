const define = Object.defineProperty;
const createAttrs = () => Object.create(null);

function entity(schema) {
  return function decorator(Class) {
    return new Proxy(Class, {
      construct(target, argumentsList, newTarget) {
        const instance = Reflect.construct(target, argumentsList, newTarget);
        const [ passedAttributes ] = argumentsList;
        let attributes = createAttrs();

        define(instance, 'attributes', {
          get() {
            return attributes;
          },

          set(newAttributes) {
            attributes = createAttrs();

            Object.keys(schema).forEach((attr) => {
              attributes[attr] = newAttributes[attr];
            });
          }
        });

        Object.keys(schema).forEach((attr) => {
          instance.attributes[attr] = passedAttributes[attr];

          define(instance, attr, {
            get() {
              return this.attributes[attr];
            },

            set(value) {
              this.attributes[attr] = value;
            }
          });
        });

        return instance;
      }
    });
  };
}

module.exports = entity;
