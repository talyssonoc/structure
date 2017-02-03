const Errors = require('../errors');
const Coercion = require('../coercion');
const Validation = require('../validation');

function normalizeTypeDescriptor(schemaOptions, attribute, attributeName) {
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
      attribute.itemType = normalizeTypeDescriptor(schemaOptions, attribute.itemType, 'itemType');
    }

    return Object.assign({}, attribute, {
      coerce: Coercion.for(attribute, attribute.itemType),
      validation: Validation.forAttribute(attribute)
    });

  case 'function':
  case 'string':
    return normalizeTypeDescriptor(schemaOptions, { type: attribute }, attributeName);

  default:
    throw Errors.invalidType(attributeName);
  }
}

exports.normalize = normalizeTypeDescriptor;
