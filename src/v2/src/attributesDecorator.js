const Schema = require('./schema');
const Symbols = require('./symbols');

module.exports = function attributes(attributesDescriptors, options = {}) {
  return function decorator(Class) {
    const schema = Schema.for({
      wrappedClass: Class,
      attributesDescriptors,
      options,
    });

    const StructureClass = new Proxy(Class, {
      construct(wrappedClass, constructorArgs, proxy) {
        const instance = Reflect.construct(wrappedClass, constructorArgs, proxy);

        const passedAttributes = { ...constructorArgs[0] };

        return schema.initializeInstance(instance, {
          attributes: passedAttributes,
        });
      },
    });

    Object.defineProperty(StructureClass, Symbols.SCHEMA, {
      value: schema,
    });

    return StructureClass;
  };
};
