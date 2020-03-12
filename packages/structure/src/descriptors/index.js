const { isObject } = require('lodash');
const { SCHEMA, ATTRIBUTES, DEFAULT_ACCESSOR } = require('../symbols');
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

    const attributeDescriptor = findAttributeDescriptor(name);

    if (isDefaultAccessor(attributeDescriptor.get)) {
      attributeDescriptor.get = defaultGetterFor(name);
    }

    if (isDefaultAccessor(attributeDescriptor.set)) {
      attributeDescriptor.set = defaultSetterFor(name);
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

  function defaultGetterFor(name) {
    function get() {
      return this.get(name);
    }

    get[DEFAULT_ACCESSOR] = true;

    return get;
  }

  function defaultSetterFor(name) {
    function set(value) {
      this.set(name, value);
    }

    set[DEFAULT_ACCESSOR] = true;

    return set;
  }

  function isDefaultAccessor(accessor) {
    return !accessor || accessor[DEFAULT_ACCESSOR];
  }

  function findAttributeDescriptor(propertyName) {
    let proto = StructureClass.prototype;

    while (proto !== Object.prototype) {
      const attributeDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

      if (attributeDescriptor) {
        return {
          ...attributeDescriptor,
          enumerable: false,
          configurable: true,
        };
      }

      proto = proto.__proto__;
    }

    return {};
  }
};
