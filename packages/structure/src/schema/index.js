const AttributeDefinitions = require('./AttributeDefinitions');
const Initialization = require('../initialization');
const Validation = require('../validation');
const Serialization = require('../serialization');
const { SCHEMA } = require('../symbols');

class Schema {
  static for({ attributeDefinitions, wrappedClass, options }) {
    const parentSchema = wrappedClass[SCHEMA];

    if (parentSchema) {
      return this.extend(parentSchema, {
        attributeDefinitions,
        wrappedClass,
        options,
      });
    }

    return new this({
      attributeDefinitions,
      wrappedClass,
      options,
    });
  }

  static extend(parentSchema, { attributeDefinitions, wrappedClass, options }) {
    const parentAttributes = parentSchema.attributeDefinitions.byKey();

    attributeDefinitions = {
      ...parentAttributes,
      ...attributeDefinitions,
    };

    options = {
      ...parentSchema.options,
      ...options,
      dynamics: {
        ...parentSchema.dynamics,
        ...options.dynamics,
      },
    };

    return new this({
      attributeDefinitions,
      wrappedClass,
      options,
    });
  }

  constructor({ attributeDefinitions, wrappedClass, options }) {
    this.options = applyDefaultOptions(options);
    this.attributeDefinitions = AttributeDefinitions.for(attributeDefinitions, { schema: this });
    this.wrappedClass = wrappedClass;
    this.identifier = options.identifier || wrappedClass.name;

    this.initialization = Initialization.for(this);
    this.validation = Validation.for(this);
    this.serialize = Serialization.serialize;
  }

  initializeInstance(instance, { attributes }) {
    return this.initialization.initialize(instance, { attributes });
  }

  hasDynamicTypeFor(typeIdentifier) {
    return Boolean(this.options.dynamics[typeIdentifier]);
  }

  dynamicTypeFor(typeIdentifier) {
    return this.options.dynamics[typeIdentifier]();
  }

  validateAttributes(attributes) {
    if (attributes[SCHEMA]) {
      attributes = attributes.toJSON();
    }

    return this.validation.validate(attributes);
  }

  validateInstance(instance) {
    const attributes = instance.toJSON();

    return this.validation.validate(attributes);
  }

  coerce(newAttributes) {
    const attributes = Object.create(null);

    for (const attributeDefinition of this.attributeDefinitions) {
      const { name } = attributeDefinition;
      const value = newAttributes[name];
      attributes[name] = attributeDefinition.coerce(value);
    }

    return attributes;
  }
}

const defaultOptions = {
  coercion: true,
};

const applyDefaultOptions = (options) => ({
  ...defaultOptions,
  ...options,
});

module.exports = Schema;
