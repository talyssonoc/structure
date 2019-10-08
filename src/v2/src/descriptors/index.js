const { isObject } = require('lodash');
const { SCHEMA, ATTRIBUTES } = require('../symbols');
const Errors = require('../../../errors');
const StrictMode = require('../strictMode');
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
    this.setSerialization();
  }

  setSchema() {
    defineProperty(this.StructureClass, SCHEMA, {
      value: this.schema,
    });

    defineProperty(this.StructureClass.prototype, SCHEMA, {
      value: this.schema,
    });
  }

  setBuildStrict() {
    const strictMode = StrictMode.for(this.schema, this.StructureClass);

    defineProperty(this.StructureClass, 'buildStrict', {
      value: strictMode.buildStrict,
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

  setSerialization() {
    const { schema, StructureClass } = this;

    defineProperty(StructureClass.prototype, 'toJSON', {
      value() {
        return schema.serialize(this);
      },
    });
  }
}

module.exports = Descriptors;
