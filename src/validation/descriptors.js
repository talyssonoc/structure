const { SCHEMA, VALIDATE } = require('../symbols');

exports.validationDescriptorForSchema = function validationDescriptorForSchema(
  schema
) {
  const validation = schema[VALIDATE];

  return {
    value: function validate() {
      const serializedStructure = this.toJSON();

      return validateData(validation, serializedStructure);
    },
  };
};

exports.staticValidationDescriptorForSchema = function staticValidationDescriptorForSchema(
  schema
) {
  const validation = schema[VALIDATE];

  return {
    value: function validate(data) {
      if (data[SCHEMA]) {
        data = data.toJSON();
      }

      return validateData(validation, data);
    },
  };
};

function validateData(validation, data) {
  const errors = validation.validate(data);

  if (errors) {
    return {
      valid: false,
      errors,
    };
  }

  return { valid: true };
}
