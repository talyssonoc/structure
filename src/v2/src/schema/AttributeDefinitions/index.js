const AttributeDefinition = require('./AttributeDefinition');

class AttributeDefinitions extends Array {
  static for(attributeDefinitions) {
    attributeDefinitions = Object.keys(attributeDefinitions).map((attributeName) =>
      AttributeDefinition.for(attributeName, attributeDefinitions[attributeName])
    );

    return new this(attributeDefinitions);
  }

  constructor(attributeDefinitions) {
    super(...attributeDefinitions);

    for (let attributeDefinition of attributeDefinitions) {
      this[attributeDefinition.name] = attributeDefinition;
    }
  }
}

module.exports = AttributeDefinitions;
