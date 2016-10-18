const typeCoercion = require('./typeCoercion');

function normalizeAttribute(attribute, attributeName) {
  switch(typeof attribute) {
    case 'object':
      if(!attribute.type) {
        throw new Error(`Missing type for attribute: ${ attributeName }`);
      }

      return Object.assign({}, attribute, {
        coerce: typeCoercion.coercionFor(attribute.type)
      });

    case 'function':
      return {
        type: attribute,
        coerce: typeCoercion.coercionFor(attribute)
      };

    default:
      throw new Error(`Invalid type for attribute: ${ attributeName }`);
  }
};

module.exports = function normalizeSchema(rawSchema) {
  const schema = Object.create(null);

  Object.keys(rawSchema).forEach((attributeName) => {
    schema[attributeName] = normalizeAttribute(rawSchema[attributeName], attributeName);
  });

  return schema;
};
