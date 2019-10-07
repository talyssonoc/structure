const AttributeDefinitions = require('./AttributeDefinitions');
const Initialization = require('../initialization');

class Schema {
  static for({ attributeDefinitions, wrappedClass, options }) {
    return new this({
      attributeDefinitions,
      wrappedClass,
      options,
    });
  }

  constructor({ attributeDefinitions, wrappedClass, options }) {
    this.attributeDefinitions = AttributeDefinitions.for(attributeDefinitions, { schema: this });
    this.wrappedClass = wrappedClass;
    this.options = options;

    this.initialization = Initialization.for(this);
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }

  dynamicTypeFor(typeIdentifier) {
    return this.options.dynamics[typeIdentifier];
  }
}

module.exports = Schema;
