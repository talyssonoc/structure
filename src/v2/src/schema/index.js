const AttributeDefinitions = require('./AttributeDefinitions');
const Initialization = require('../initialization');

class Schema {
  static for({ attributesDefinitions, wrappedClass, options }) {
    return new this({
      attributesDefinitions: AttributeDefinitions.for(attributesDefinitions),
      wrappedClass,
      options,
    });
  }

  constructor({ attributesDefinitions, wrappedClass, options }) {
    this.attributesDefinitions = attributesDefinitions;
    this.wrappedClass = wrappedClass;
    this.options = options;

    this.initialization = Initialization.for(this);
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }
}

module.exports = Schema;
