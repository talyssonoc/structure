const { SCHEMA, ATTRIBUTES } = require('../symbols');
const { defineProperty } = Object;

class Descriptors {
  constructor(schema, StructureClass) {
    this.schema = schema;
    this.StructureClass = StructureClass;
  }

  setDescriptors() {
    this.setSchema();
    this.setAttributesGetterAndSetter();
    this.setEachAttributeGetterAndSetter();
  }

  setSchema() {
    defineProperty(this.StructureClass, SCHEMA, {
      value: this.schema,
    });
  }

  setAttributesGetterAndSetter() {
    defineProperty(this.StructureClass.prototype, 'attributes', {
      get() {
        return this[ATTRIBUTES];
      },

      set(newAttributes) {
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
    return {
      get() {
        return this.attributes[attrDefinition.name];
      },

      set(value) {
        this.attributes[attrDefinition.name] = value; //this.schema[attributeName].coerce(value);
      },
    };
  }
}

module.exports = Descriptors;
