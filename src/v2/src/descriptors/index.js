const { isObject } = require('lodash');
const { SCHEMA, ATTRIBUTES } = require('../symbols');
const Errors = require('../../../errors');
const { defineProperty } = Object;

class Descriptors {
  constructor(schema, StructureClass) {
    this.schema = schema;
    this.StructureClass = StructureClass;
  }

  setDescriptors() {
    this.setSchema();
    this.setBuildStrict();
    this.setAttributesGetterAndSetter();
    this.setEachAttributeGetterAndSetter();
    this.setValidation();
  }

  setSchema() {
    defineProperty(this.StructureClass, SCHEMA, {
      value: this.schema,
    });
  }

  setBuildStrict() {
    defineProperty(this.StructureClass, 'buildStrict', {
      value: this.schema.strictMode.buildStrict,
    });
  }

  setAttributesGetterAndSetter() {
    defineProperty(this.StructureClass.prototype, 'attributes', {
      get() {
        return this[ATTRIBUTES];
      },

      set(newAttributes) {
        if (!isObject(newAttributes)) {
          throw Errors.nonObjectAttributes();
        }

        defineProperty(this, ATTRIBUTES, {
          configurable: true,
          value: newAttributes,
        });
      },
    });
  }

  setEachAttributeGetterAndSetter() {
    this.schema.attributeDefinitions.forEach((attrDefinition) => {
      defineProperty(
        this.StructureClass.prototype,
        attrDefinition.name,
        this.attributeDescriptor(attrDefinition)
      );
    });
  }

  attributeDescriptor(attrDefinition) {
    const { schema } = this;
    const { name } = attrDefinition;

    return {
      get() {
        return this.attributes[name];
      },

      set(value) {
        this.attributes[name] = schema.attributeDefinitions[name].coerce(value);
      },
    };
  }

  setValidation() {
    const { schema, StructureClass } = this;

    defineProperty(StructureClass, 'validate', {
      value(attributes) {
        return schema.validateAttributes(attributes);
      },
    });

    defineProperty(StructureClass.prototype, 'validate', {
      value() {
        return schema.validateInstance(this);
      },
    });
  }
}

module.exports = Descriptors;
