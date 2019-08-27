const Errors = require('../errors');
const DefaultValidationError = require('../errors/DefaultValidationError');

exports.buildStrictDescriptorFor = function buildStrictDescriptorFor(
  StructureClass,
  schemaOptions
) {
  const StructureValidationError =
    schemaOptions.strictValidationErrorClass || DefaultValidationError;

  return {
    value: function buildStrict(constructorArgs) {
      const instance = new StructureClass(constructorArgs);

      const { valid, errors } = instance.validate();

      if (!valid) {
        throw Errors.invalidAttributes(errors, StructureValidationError);
      }

      return instance;
    },
  };
};
