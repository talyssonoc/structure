const { coercionFor } = require('./typeCoercion');
const { validationForAttribute, validationForSchema } = require('./validation');
const { VALIDATE } = require('./symbols');

function normalizeAttribute(attribute, attributeName) {
  switch(typeof attribute) {
  case 'object':
    if(!attribute.type) {
      throw new Error(`Missing type for attribute: ${ attributeName }.`);
    }

    if(typeof attribute.type !== 'function') {
      throw new TypeError(`Attribute type must be a constructor: ${ attributeName }.`);
    }

    if(attribute.itemType) {
      attribute.itemType = normalizeAttribute(attribute.itemType, 'itemType');
    }

    return Object.assign({}, attribute, {
      coerce: coercionFor(attribute, attribute.itemType),
      validation: validationForAttribute(attribute)
    });

  case 'function':
    var normalizedType = { type: attribute };
    normalizedType.coerce = coercionFor(normalizedType);
    normalizedType.validation = validationForAttribute(normalizedType);

    return normalizedType;

  default:
    throw new TypeError(`Invalid type for attribute: ${ attributeName }.`);
  }
}

function normalizeSchema(rawSchema) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = normalizeAttribute(rawSchema[attributeName], attributeName);
  });

  const schemaValidation = validationForSchema(schema);

  Object.defineProperty(schema, VALIDATE, {
    value: schemaValidation
  });


  return schema;
}

exports.normalizeSchema = normalizeSchema;
exports.VALIDATE = VALIDATE;
