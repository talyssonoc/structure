const AttributeDescriptors = require('./attributeDescriptors');
const Initialization = require('../initialization');

class Schema {
  static for({ attributesDescriptors, wrappedClass, options }) {
    return new Schema({
      attributeDescriptors: AttributeDescriptors.for(attributesDescriptors),
      wrappedClass,
      options,
    });
  }

  constructor({ attributeDescriptors, wrappedClass, options }) {
    this.attributeDescriptors = attributeDescriptors;
    this.wrappedClass = wrappedClass;
    this.options = options;

    this.initialization = Initialization.for(this);
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }
}

module.exports = Schema;
