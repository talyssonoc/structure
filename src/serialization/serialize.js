const { SCHEMA } = require('../symbols');
const getType = require('../typeResolver');

function serialize(structure) {
  if(structure === undefined) {
    return;
  }

  const schema = structure[SCHEMA];
  const serializedStructure = Object.create(null);

  for(let attrName in schema) {
    let attribute = structure[attrName];

    if(attribute == null) {
      continue;
    }

    let serializedValue;

    if(schema[attrName].itemType && getTypeSchema(schema[attrName].itemType)) {
      serializedValue = attribute.map(serialize);
    } else if(getTypeSchema(schema[attrName])) {
      serializedValue = serialize(attribute);
    } else {
      serializedValue = attribute;
    }

    serializedStructure[attrName] = serializedValue;
  }

  return serializedStructure;
}

function getTypeSchema(typeDescriptor) {
  return getType(typeDescriptor)[SCHEMA];
}

module.exports = serialize;
