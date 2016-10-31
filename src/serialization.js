const { SCHEMA } = require('./symbols');

function serialize(entity) {
  if(entity === undefined) {
    return;
  }

  const schema = entity[SCHEMA];

  const attrNames = Object.keys(schema);
  const serializedEntity = Object.create(null);

  for(let i = 0; i < attrNames.length; i++) {
    let attrName = attrNames[i];
    let attribute = entity[attrName];

    if(attribute == null) {
      continue;
    }

    let serializedValue;

    if(schema[attrName].items && schema[attrName].items.type[SCHEMA] !== undefined) {
      serializedValue = attribute.map(serialize);
    } else if(schema[attrName].type[SCHEMA] !== undefined) {
      serializedValue = serialize(attribute);
    } else {
      serializedValue = attribute;
    }

    serializedEntity[attrName] = serializedValue;
  }

  return serializedEntity;
}

exports.serialize = serialize;
