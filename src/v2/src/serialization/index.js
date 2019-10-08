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

function serializeAttribute(attribute, attributeDefinition) {
  if (attributeDefinition.isArrayType) {
    return attribute.map(serialize);
  }

  if (attributeDefinition.isNestedSchema) {
    return serialize(attribute);
  }

  return attribute;
}

exports.serialize = serialize;
