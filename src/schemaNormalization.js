const { coercionFor } = require('./typeCoercion');
const { validationForAttribute, validationForSchema } = require('./validation');
const { VALIDATE } = require('./symbols');

function normalizeSchema(rawSchema, schemaOptions) {
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
      throw new Error(`Missing type for attribute: ${ attributeName }.`);
    }

    if (typeof attribute.type === 'string') {
      if(!schemaOptions.dynamics[attribute.type]) {
        throw new Error(`There is no dynamic type for attribute: ${ attributeName }.`);
      }

      attribute.getType = schemaOptions.dynamics[attribute.type];
      attribute.dynamicType = true;
    } else if(typeof attribute.type !== 'function') {
      throw new TypeError(`Attribute type must be a constructor: ${ attributeName }.`);
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
    throw new TypeError(`Invalid type for attribute: ${ attributeName }.`);
  }
}

exports.normalizeSchema = normalizeSchema;
exports.VALIDATE = VALIDATE;
