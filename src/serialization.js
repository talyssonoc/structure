const { SCHEMA } = require('./symbols');

function serialize(structure) {
  if(structure === undefined) {
    return;
  }

  const schema = structure[SCHEMA];

  const attrNames = Object.keys(schema);
  const serializedStructure = Object.create(null);

  for(let i = 0; i < attrNames.length; i++) {
    let attrName = attrNames[i];
    let attribute = structure[attrName];

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

    serializedStructure[attrName] = serializedValue;
  }

  return serializedStructure;
}

exports.serialize = serialize;
