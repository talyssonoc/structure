const AttributeDescriptor = require('./AttributeDescriptor');

class AttributeDescriptors extends Array {
  static for(rawAttributeDescriptors) {
    const attributesDescriptors = Object.keys(rawAttributeDescriptors).map((attributeName) =>
      AttributeDescriptor.for(attributeName, rawAttributeDescriptors[attributeName])
    );

    return new this(attributesDescriptors);
  }

  constructor(attributesDescriptors) {
    super(...attributesDescriptors);

    for (let attributesDescriptor of attributesDescriptors) {
      this[attributesDescriptor.name] = attributesDescriptor;
    }
  }
}

module.exports = AttributeDescriptors;
