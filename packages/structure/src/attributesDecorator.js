const Schema = require('./schema');
const Descriptors = require('./descriptors');
const Errors = require('./errors');

module.exports = function attributes(attributeDefinitions, options = {}) {
  if (typeof options !== 'object') {
    throw Errors.classAsSecondParam(options);
  }

  return function decorator(Class) {
    const schema = Schema.for({
      wrappedClass: Class,
      attributeDefinitions,
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

    Descriptors.addTo(schema, StructureClass);

    return StructureClass;
  };
};
