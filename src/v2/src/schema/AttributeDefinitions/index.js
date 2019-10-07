const AttributeDefinition = require('./AttributeDefinition');

class AttributeDefinitions extends Array {
  static for(attributeDefinitions) {
    attributeDefinitions = Object.keys(attributeDefinitions).map((attributeName) => ({
      name: attributeName,
      options: attributeDefinitions[attributeName],
    }));

    return new this(attributeDefinitions);
  }

  constructor(attributeDefinitions) {
    attributeDefinitions = attributeDefinitions
      .map(({ name, options }) => AttributeDefinition.for(name, options))
      .sort(AttributeDefinition.compare);

    super(...attributeDefinitions);

    for (let attributeDefinition of attributeDefinitions) {
      this[attributeDefinition.name] = attributeDefinition;
    }
  }
}

module.exports = AttributeDefinitions;
