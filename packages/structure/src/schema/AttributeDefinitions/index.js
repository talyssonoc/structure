const AttributeDefinition = require('./AttributeDefinition');

class AttributeDefinitions extends Array {
  static for(attributeDefinitions, { schema }) {
    attributeDefinitions = Object.keys(attributeDefinitions).map((attributeName) => ({
      name: attributeName,
      options: attributeDefinitions[attributeName],
    }));

    return new this(attributeDefinitions, { schema });
  }

  constructor(attributeDefinitions, { schema }) {
    attributeDefinitions = attributeDefinitions
      .map(({ name, options }) => AttributeDefinition.for(name, options, schema))
      .sort(AttributeDefinition.compare);

    super(...attributeDefinitions);

    for (let attributeDefinition of attributeDefinitions) {
      this[attributeDefinition.name] = attributeDefinition;
    }
  }

  byKey() {
    return this.reduce(
      (attributeDefinitions, attrDefinition) => ({
        ...attributeDefinitions,
        [attrDefinition.name]: this[attrDefinition.name],
      }),
      {}
    );
  }
}

module.exports = AttributeDefinitions;
