const AttributeDefinitions = require('./AttributeDefinitions');
const Initialization = require('../initialization');

class Schema {
  static for({ attributeDefinitions, wrappedClass, options }) {
    return new this({
      attributeDefinitions: AttributeDefinitions.for(attributeDefinitions),
      wrappedClass,
      options,
    });
  }

  constructor({ attributeDefinitions, wrappedClass, options }) {
    this.attributeDefinitions = attributeDefinitions;
    this.wrappedClass = wrappedClass;
    this.options = options;

    this.initialization = Initialization.for(this);
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }
}

module.exports = Schema;
