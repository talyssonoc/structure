const Errors = require('../errors')

exports.buildStrictDescriptorFor = function buildStrictDescriptorFor(StructureClass, schemaOptions) {
  return {
    value: function buildStrict(constructorArgs) {
      const instance = new StructureClass(constructorArgs);

      const { valid, errors } = instance.validate();

      if (!valid) {
        throw Errors.invalidAttributes(errors, schemaOptions.strictValidationErrorClass);
      }

      return instance;
    }
  }
}
