const { isObject } = require('lodash');
const { SCHEMA, ATTRIBUTES } = require('../symbols');
const Errors = require('../errors');
const StrictMode = require('../strictMode');
const Cloning = require('../cloning');
const Attributes = require('../attributes');
const { defineProperty, defineProperties } = Object;

exports.addTo = function addDescriptorsTo(schema, StructureClass) {
  setSchema();
  setBuildStrict();
  setAttributesGetterAndSetter();
  setGenericAttributeGetterAndSetter();
  setEachAttributeGetterAndSetter();
  setValidation();
  setSerialization();
  setCloning();

  function setSchema() {
    defineProperty(StructureClass, SCHEMA, {
      value: schema,
    });

    defineProperty(StructureClass.prototype, SCHEMA, {
      value: schema,
    });
  }

  function setBuildStrict() {
    const strictMode = StrictMode.for(schema, StructureClass);

    defineProperty(StructureClass, 'buildStrict', {
      value: strictMode.buildStrict,
    });
  }

  function setAttributesGetterAndSetter() {
    defineProperty(StructureClass.prototype, 'attributes', {
      get() {
        return this[ATTRIBUTES];
      },

      set(newAttributes) {
        if (!isObject(newAttributes)) {
          throw Errors.nonObjectAttributes();
        }

        const coercedAttributes = schema.coerce(newAttributes);

        Attributes.setInInstance(this, coercedAttributes);
      },
    });
  }

  function setGenericAttributeGetterAndSetter() {
    defineProperties(StructureClass.prototype, {
      get: {
        value: function get(attributeName) {
          return this.attributes[attributeName];
        },
      },
      set: {
        value: function set(attributeName, attributeValue) {
          const attributeDefinition = schema.attributeDefinitions[attributeName];

          if (!attributeDefinition) {
            throw Errors.inexistentAttribute(attributeName);
          }

          const coercedValue = attributeDefinition.coerce(attributeValue);
          this.attributes[attributeName] = coercedValue;
        },
      },
    });
  }

  function setEachAttributeGetterAndSetter() {
    schema.attributeDefinitions.forEach((attrDefinition) => {
      defineProperty(
        StructureClass.prototype,
        attrDefinition.name,
        attributeDescriptorFor(attrDefinition)
      );
    });
  }

  function attributeDescriptorFor(attrDefinition) {
    const { name } = attrDefinition;

    const originalAttributeDescriptor = Object.getOwnPropertyDescriptor(
      StructureClass.prototype,
      name
    );

    const attributeDescriptor = {
      ...originalAttributeDescriptor,
      enumerable: false,
      configurable: true,
    };

    if (!attributeDescriptor.get) {
      attributeDescriptor.get = function get() {
        return this.get(name);
      };
    }

    if (!attributeDescriptor.set) {
      attributeDescriptor.set = function set(value) {
        this.set(name, value);
      };
    }

    return attributeDescriptor;
  }

  function setValidation() {
    defineProperty(StructureClass, 'validate', {
      value: function validate(attributes) {
        return schema.validateAttributes(attributes);
      },
    });

    defineProperty(StructureClass.prototype, 'validate', {
      value: function validate() {
        return schema.validateInstance(this);
      },
    });
  }

  function setSerialization() {
    defineProperty(StructureClass.prototype, 'toJSON', {
      value: function toJSON() {
        return schema.serialize(this);
      },
    });
  }

  function setCloning() {
    const cloning = Cloning.for(StructureClass);

    defineProperty(StructureClass.prototype, 'clone', {
      value: cloning.clone,
    });
  }
};
