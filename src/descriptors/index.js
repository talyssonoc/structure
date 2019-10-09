const { isObject } = require('lodash');
const { SCHEMA, ATTRIBUTES } = require('../symbols');
const Errors = require('../errors');
const StrictMode = require('../strictMode');
const Cloning = require('../cloning');
const { defineProperty } = Object;

exports.addTo = function addDescriptorsTo(schema, StructureClass) {
  setSchema();
  setBuildStrict();
  setAttributesGetterAndSetter();
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

        defineProperty(this, ATTRIBUTES, {
          configurable: true,
          value: newAttributes,
        });
      },
    });
  }

  function setEachAttributeGetterAndSetter() {
    schema.attributeDefinitions.forEach((attrDefinition) => {
      defineProperty(
        StructureClass.prototype,
        attrDefinition.name,
        attributeDescriptor(attrDefinition)
      );
    });
  }

  function attributeDescriptor(attrDefinition) {
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
