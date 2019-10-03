const Validation = require('../validation');
const Initialization = require('../initialization');
const TypeDescriptor = require('../typeDescriptor');
const { VALIDATE, INITIALIZE, IDENTIFIER } = require('../symbols');

module.exports = function normalizeSchema({ schema: rawSchema, schemaOptions, wrappedClass }) {
  const schema = Object.create(null);

  Object.defineProperty(schema, IDENTIFIER, {
    value: wrappedClass.name,
  });

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = TypeDescriptor.normalize(
      schemaOptions,
      rawSchema[attributeName],
      attributeName
    );
  });

  const schemaValidation = Validation.forSchema(schema);

  Object.defineProperty(schema, VALIDATE, {
    value: schemaValidation,
  });

  const initialization = Initialization.forSchema(schema);

  Object.defineProperty(schema, INITIALIZE, {
    value: initialization,
  });

  return schema;
};
