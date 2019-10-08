const { SCHEMA } = require('../symbols');

function serialize(structure) {
  if (structure == null) {
    return structure;
  }

  return serializeStructure(structure);
}

function serializeStructure(structure) {
  const schema = structure[SCHEMA];

  const serializedStructure = Object.create(null);

  for (let attributeDefinition of schema.attributeDefinitions) {
    let attributeValue = structure[attributeDefinition.name];

    if (attributeDefinition.shouldSerialize(attributeValue)) {
      serializedStructure[attributeDefinition.name] = serializeAttribute(
        attributeValue,
        attributeDefinition
      );
    }
  }

  return serializedStructure;
}

function serializeAttribute(attributeValue, attributeDefinition) {
  if (attributeDefinition.itemsAreStructures) {
    return attributeValue.map(serialize);
  }

  if (attributeDefinition.isNestedSchema) {
    return serialize(attributeValue);
  }

  return attributeValue;
}

exports.serialize = serialize;
