const { coercionFor } = require('./typeCoercion');
const { validationForAttribute, validationForSchema } = require('./validation');
const VALIDATE = Symbol('validate');

function normalizeAttribute(attribute, attributeName) {
  switch(typeof attribute) {
  case 'object':
    if(!attribute.type) {
      throw new Error(`Missing type for attribute: ${ attributeName }.`);
    }

    if(typeof attribute.type !== 'function') {
      throw new Error(`Attribute type must be a constructor: ${ attributeName }.`);
    }

    if(attribute.items) {
      attribute.items = normalizeAttribute(attribute.items, 'items');
    }

    return Object.assign({}, attribute, {
      coerce: coercionFor(attribute, attribute.items),
      validation: validationForAttribute(attribute)
    });

  case 'function':
    var normalizedType = { type: attribute };
    normalizedType.coerce = coercionFor(normalizedType);
    normalizedType.validation = validationForAttribute(normalizedType);

    return normalizedType;

  default:
    throw new Error(`Invalid type for attribute: ${ attributeName }.`);
  }
}

function normalizeSchema(rawSchema) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = normalizeAttribute(rawSchema[attributeName], attributeName);
  });

  Object.defineProperty(schema, VALIDATE, {
    value: validationForSchema(schema)
  });

  return schema;
}

exports.normalizeSchema = normalizeSchema;
exports.VALIDATE = VALIDATE;
