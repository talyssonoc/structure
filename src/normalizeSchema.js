const typeCoercion = require('./typeCoercion');

function normalizeAttribute(attribute, attributeName) {
  switch(typeof attribute) {
  case 'object':
    if(!attribute.type) {
      throw new Error(`Missing type for attribute: ${ attributeName }.`);
    }

    if(typeof attribute.type !== 'function') {
      throw new Error(`Attribute type must be a constructor: ${ attributeName }.`);
    }

    if(attribute.items && typeof attribute.items === 'function') {
      attribute.items = {
        type: attribute.items
      };
    }

    return Object.assign({}, attribute, {
      coerce: typeCoercion.coercionFor(attribute.type, attribute.items)
    });

  case 'function':
    return {
      type: attribute,
      coerce: typeCoercion.coercionFor(attribute)
    };

  default:
    throw new Error(`Invalid type for attribute: ${ attributeName }.`);
  }
}

module.exports = function normalizeSchema(rawSchema) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = normalizeAttribute(rawSchema[attributeName], attributeName);
  });

  return schema;
};
