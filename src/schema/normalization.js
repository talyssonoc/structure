const Validation = require('../validation');
const TypeDescriptor = require('../typeDescriptor');
const { VALIDATE } = require('../symbols');

module.exports = function normalizeSchema(rawSchema, schemaOptions) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = TypeDescriptor.normalize(schemaOptions, rawSchema[attributeName], attributeName);
  });

  const schemaValidation = Validation.forSchema(schema);

  Object.defineProperty(schema, VALIDATE, {
    value: schemaValidation
  });

  return schema;
};
