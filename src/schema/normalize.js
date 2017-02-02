const { coercionFor } = require('../coercion');
const { validationForAttribute, validationForSchema } = require('../validation');
const { VALIDATE } = require('../symbols');
const Errors = require('../errors');

module.exports = function normalize(rawSchema, schemaOptions) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = normalizeAttribute(schemaOptions, rawSchema[attributeName], attributeName);
  });

  const schemaValidation = validationForSchema(schema);

  Object.defineProperty(schema, VALIDATE, {
    value: schemaValidation
  });

  return schema;
}

function normalizeAttribute(schemaOptions, attribute, attributeName) {
  switch(typeof attribute) {
  case 'object':
    if(!attribute.type) {
      throw Errors.missingType(attributeName);
    }

    if (typeof attribute.type === 'string') {
      if(!schemaOptions.dynamics || !schemaOptions.dynamics[attribute.type]) {
        throw Errors.missingDynamicType(attributeName);
      }

      attribute.getType = schemaOptions.dynamics[attribute.type];
      attribute.dynamicType = true;
    } else if(typeof attribute.type !== 'function') {
      throw Errors.invalidType(attributeName);
    }

    if(attribute.itemType) {
      attribute.itemType = normalizeAttribute(schemaOptions, attribute.itemType, 'itemType');
    }

    return Object.assign({}, attribute, {
      coerce: coercionFor(attribute, attribute.itemType),
      validation: validationForAttribute(attribute)
    });

  case 'function':
  case 'string':
    return normalizeAttribute(schemaOptions, { type: attribute }, attributeName);

  default:
    throw Errors.invalidType(attributeName);
  }
}
