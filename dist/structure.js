(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('joi'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'joi', 'lodash'], factory) :
  (global = global || self, factory(global.Structure = {}, global.joi, global._));
}(this, function (exports, joi, lodash) { 'use strict';

  joi = joi && joi.hasOwnProperty('default') ? joi['default'] : joi;
  lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var isPlainObject = lodash.isPlainObject,
      isFunction = lodash.isFunction;

  var mapToJoi = function mapToJoi(typeDescriptor, _ref) {
    var initial = _ref.initial,
        mappings = _ref.mappings;
    var joiSchema = mappings.reduce(function (joiSchema, _ref2) {
      var _ref3 = _slicedToArray(_ref2, 3),
          optionName = _ref3[0],
          joiMethod = _ref3[1],
          passValueToJoi = _ref3[2];

      var attributeDescriptor = typeDescriptor[optionName];

      if (attributeDescriptor === undefined) {
        return joiSchema;
      }

      if (shouldPassValueToJoi(passValueToJoi, attributeDescriptor)) {
        return joiSchema[joiMethod](attributeDescriptor);
      }

      return joiSchema[joiMethod]();
    }, initial);
    joiSchema = requiredOption(typeDescriptor, {
      initial: joiSchema
    });
    return joiSchema;
  };

  function shouldPassValueToJoi(passValueToJoi, attributeDescriptor) {
    return passValueToJoi && (!isFunction(passValueToJoi) || passValueToJoi(attributeDescriptor));
  }

  function mapValueOrReference(valueOrReference) {
    if (isPlainObject(valueOrReference)) {
      return joi.ref(valueOrReference.attr);
    }

    return valueOrReference;
  }

  var mapToJoiWithReference = function mapToJoiWithReference(typeDescriptor, _ref4) {
    var initial = _ref4.initial,
        mappings = _ref4.mappings;
    return mappings.reduce(function (joiSchema, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          optionName = _ref6[0],
          joiMethod = _ref6[1];

      var attributeDescriptor = typeDescriptor[optionName];

      if (attributeDescriptor === undefined) {
        return joiSchema;
      }

      attributeDescriptor = mapValueOrReference(attributeDescriptor);
      return joiSchema[joiMethod](attributeDescriptor);
    }, initial);
  };

  var equalOption = function equalOption(typeDescriptor, _ref7) {
    var initial = _ref7.initial;
    var possibilities = typeDescriptor.equal;

    if (possibilities === undefined) {
      return initial;
    }

    if (Array.isArray(possibilities)) {
      possibilities = possibilities.map(mapValueOrReference);
    } else {
      possibilities = mapValueOrReference(possibilities);
    }

    return initial.equal(possibilities);
  };

  function requiredOption(typeDescriptor, _ref8) {
    var initial = _ref8.initial;

    if (typeDescriptor.required) {
      return initial.required();
    }

    return initial;
  }

  var requiredOption_1 = requiredOption;
  var utils = {
    mapToJoi: mapToJoi,
    mapToJoiWithReference: mapToJoiWithReference,
    equalOption: equalOption,
    requiredOption: requiredOption_1
  };

  var isPlainObject$1 = lodash.isPlainObject;
  var mapToJoi$1 = utils.mapToJoi,
      equalOption$1 = utils.equalOption;
  var string = {
    type: String,
    joiMappings: [['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true], ['regex', 'regex', true], ['alphanumeric', 'alphanum'], ['lowerCase', 'lowercase'], ['upperCase', 'uppercase'], ['email', 'email'], ['guid', 'guid', isPlainObject$1]],
    createJoiSchema: function createJoiSchema(typeDescriptor) {
      var joiSchema = joi.string();

      if (typeDescriptor.empty) {
        joiSchema = joiSchema.allow('');
      }

      joiSchema = equalOption$1(typeDescriptor, {
        initial: joiSchema
      });
      return mapToJoi$1(typeDescriptor, {
        initial: joiSchema,
        mappings: this.joiMappings
      });
    }
  };

  var mapToJoi$2 = utils.mapToJoi,
      mapToJoiWithReference$1 = utils.mapToJoiWithReference,
      equalOption$2 = utils.equalOption;
  var number = {
    type: Number,
    joiMappings: [['integer', 'integer'], ['precision', 'precision', true], ['multiple', 'multiple', true], ['positive', 'positive', true], ['negative', 'negative', true]],
    valueOrRefOptions: [['min', 'min'], ['greater', 'greater'], ['max', 'max'], ['less', 'less']],
    createJoiSchema: function createJoiSchema(typeDescriptor) {
      var joiSchema = mapToJoiWithReference$1(typeDescriptor, {
        initial: joi.number(),
        mappings: this.valueOrRefOptions
      });
      joiSchema = equalOption$2(typeDescriptor, {
        initial: joiSchema
      });
      return mapToJoi$2(typeDescriptor, {
        initial: joiSchema,
        mappings: this.joiMappings
      });
    }
  };

  var mapToJoi$3 = utils.mapToJoi,
      equalOption$3 = utils.equalOption;
  var boolean_1 = {
    type: Boolean,
    joiMappings: [],
    createJoiSchema: function createJoiSchema(typeDescriptor) {
      var joiSchema = joi.boolean();
      joiSchema = equalOption$3(typeDescriptor, {
        initial: joiSchema
      });
      return mapToJoi$3(typeDescriptor, {
        initial: joiSchema,
        mappings: this.joiMappings
      });
    }
  };

  var mapToJoi$4 = utils.mapToJoi,
      mapToJoiWithReference$2 = utils.mapToJoiWithReference,
      equalOption$4 = utils.equalOption;
  var date = {
    type: Date,
    joiMappings: [],
    valueOrRefOptions: [['min', 'min'], ['max', 'max']],
    createJoiSchema: function createJoiSchema(typeDescriptor) {
      var joiSchema = mapToJoiWithReference$2(typeDescriptor, {
        initial: joi.date(),
        mappings: this.valueOrRefOptions
      });
      joiSchema = equalOption$4(typeDescriptor, {
        initial: joiSchema
      });
      return mapToJoi$4(typeDescriptor, {
        initial: joiSchema,
        mappings: this.joiMappings
      });
    }
  };

  var symbols = {
    SCHEMA: Symbol('schema'),
    ATTRIBUTES: Symbol('attributes'),
    VALIDATE: Symbol('validate')
  };

  var SCHEMA = symbols.SCHEMA;
  var requiredOption$1 = utils.requiredOption;

  var nested = function nestedValidation(typeDescriptor) {
    if (typeDescriptor.dynamicType) {
      return validationToDynamicType(typeDescriptor);
    }

    var typeSchema = typeDescriptor.type[SCHEMA];
    var joiSchema = getNestedValidations(typeSchema);
    joiSchema = requiredOption$1(typeDescriptor, {
      initial: joiSchema
    });
    return joiSchema;
  };

  function validationToDynamicType(typeDescriptor) {
    var joiSchema = joi.lazy(function () {
      var typeSchema = typeDescriptor.getType()[SCHEMA];
      return getNestedValidations(typeSchema);
    });
    joiSchema = requiredOption$1(typeDescriptor, {
      initial: joiSchema
    });
    return joiSchema;
  }

  function getNestedValidations(typeSchema) {
    var joiSchema = joi.object();

    if (typeSchema) {
      var nestedValidations = Object.keys(typeSchema).reduce(function (validations, v) {
        validations[v] = typeSchema[v].validation;
        return validations;
      }, {});
      joiSchema = joiSchema.keys(nestedValidations);
    }

    return joiSchema;
  }

  var mapToJoi$5 = utils.mapToJoi;
  var joiMappings = [['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true]];

  var array = function arrayValidation(typeDescriptor, itemTypeDescriptor) {
    var joiSchema = joi.array().items(itemTypeDescriptor.validation);
    var canBeSparse = typeDescriptor.sparse === undefined || typeDescriptor.sparse;
    joiSchema = joiSchema.sparse(canBeSparse);
    joiSchema = mapToJoi$5(typeDescriptor, {
      initial: joiSchema,
      mappings: joiMappings
    });
    return joiSchema;
  };

  var SCHEMA$1 = symbols.SCHEMA,
      VALIDATE = symbols.VALIDATE;

  var validationDescriptorForSchema = function validationDescriptorForSchema(schema) {
    var validation = schema[VALIDATE];
    return {
      value: function validate() {
        var serializedStructure = this.toJSON();
        return validateData(validation, serializedStructure);
      }
    };
  };

  var staticValidationDescriptorForSchema = function staticValidationDescriptorForSchema(schema) {
    var validation = schema[VALIDATE];
    return {
      value: function validate(data) {
        if (data[SCHEMA$1]) {
          data = data.toJSON();
        }

        return validateData(validation, data);
      }
    };
  };

  function validateData(validation, data) {
    var errors = validation.validate(data);

    if (errors) {
      return {
        valid: false,
        errors: errors
      };
    }

    return {
      valid: true
    };
  }

  var descriptors = {
    validationDescriptorForSchema: validationDescriptorForSchema,
    staticValidationDescriptorForSchema: staticValidationDescriptorForSchema
  };

  var validations = [string, number, boolean_1, date];
  var validationDescriptorForSchema$1 = descriptors.validationDescriptorForSchema,
      staticValidationDescriptorForSchema$1 = descriptors.staticValidationDescriptorForSchema;
  var descriptorFor = validationDescriptorForSchema$1;
  var staticDescriptorFor = staticValidationDescriptorForSchema$1;

  var forAttribute = function validationForAttribute(typeDescriptor) {
    if (typeDescriptor.itemType !== undefined) {
      return array(typeDescriptor, typeDescriptor.itemType);
    }

    var validation = validations.find(function (v) {
      return v.type === typeDescriptor.type;
    });

    if (!validation) {
      return nested(typeDescriptor);
    }

    return validation.createJoiSchema(typeDescriptor);
  };

  var mapDetail = function mapDetail(_ref) {
    var message = _ref.message,
        path = _ref.path;
    return {
      message: message,
      path: path
    };
  };

  var validatorOptions = {
    abortEarly: false,
    convert: false,
    allowUnknown: false
  };

  var forSchema = function validationForSchema(schema) {
    var schemaValidation = {};
    Object.keys(schema).forEach(function (attributeName) {
      schemaValidation[attributeName] = schema[attributeName].validation;
    });
    var joiValidation = joi.object().keys(schemaValidation);
    return {
      validate: function validate(structure) {
        var validationErrors;

        var _joiValidation$valida = joiValidation.validate(structure, validatorOptions),
            error = _joiValidation$valida.error;

        if (error) {
          validationErrors = error.details.map(mapDetail);
        }

        return validationErrors;
      }
    };
  };

  var validation = {
    descriptorFor: descriptorFor,
    staticDescriptorFor: staticDescriptorFor,
    forAttribute: forAttribute,
    forSchema: forSchema
  };

  var errors = {
    classAsSecondParam: function classAsSecondParam(ErroneousPassedClass) {
      return new Error("You passed the structure class as the second parameter of attributes(). The expected usage is `attributes(schema)(".concat(ErroneousPassedClass.name || 'StructureClass', ")`."));
    },
    nonObjectAttributes: function nonObjectAttributes() {
      return new TypeError('#attributes can\'t be set to a non-object.');
    },
    arrayOrIterable: function arrayOrIterable() {
      return new TypeError('Value must be iterable or array-like.');
    },
    missingDynamicType: function missingDynamicType(attributeName) {
      return new Error("Missing dynamic type for attribute: ".concat(attributeName, "."));
    },
    invalidType: function invalidType(attributeName) {
      return new TypeError("Attribute type must be a constructor or the name of a dynamic type: ".concat(attributeName, "."));
    }
  };

  var typeResolver = function getAttributeType(typeDescriptor) {
    if (typeDescriptor.dynamicType) {
      return typeDescriptor.getType();
    }

    return typeDescriptor.type;
  };

  var array$1 = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
    return function coerceArray(rawValue) {
      if (rawValue === undefined) {
        return;
      }

      validateIfIterable(rawValue);
      var items = extractItems(rawValue);
      var instance = createInstance(typeDescriptor);
      return fillInstance(instance, items, itemTypeDescriptor);
    };
  };

  function validateIfIterable(value) {
    if (!isIterable(value)) {
      throw errors.arrayOrIterable();
    }
  }

  function isIterable(value) {
    return value != null && (value.length != null || value[Symbol.iterator]);
  }

  function extractItems(iterable) {
    if (!Array.isArray(iterable) && iterable[Symbol.iterator]) {
      return Array.apply(void 0, _toConsumableArray(iterable));
    }

    return iterable;
  }

  function createInstance(typeDescriptor) {
    var type = typeResolver(typeDescriptor);
    return new type();
  }

  function fillInstance(instance, items, itemTypeDescriptor) {
    for (var i = 0; i < items.length; i++) {
      instance.push(coerceItem(itemTypeDescriptor, items[i]));
    }

    return instance;
  }

  function coerceItem(itemTypeDescriptor, item) {
    return itemTypeDescriptor.coerce(item);
  }

  var generic = {
    isCoerced: function isCoerced(value, typeDescriptor) {
      return value instanceof typeResolver(typeDescriptor);
    },
    coerce: function coerce(value, typeDescriptor) {
      var type = typeResolver(typeDescriptor);
      return new type(value);
    }
  };

  var isFunction$1 = lodash.isFunction,
      curryRight = lodash.curryRight;
  var execute = curryRight(function (value, coercion, typeDescriptor) {
    if (value === undefined) {
      return;
    }

    if (value === null) {
      return getDefaultValue(coercion);
    }

    if (coercion.isCoerced(value, typeDescriptor)) {
      return value;
    }

    return coercion.coerce(value, typeDescriptor);
  });

  function getDefaultValue(coercion) {
    return isFunction$1(coercion.default) ? coercion.default() : coercion.default;
  }

  var coercion = {
    execute: execute
  };

  var isString = lodash.isString;
  var string$1 = {
    type: String,
    isCoerced: isString,
    default: '',
    coerce: function coerce(value) {
      return this.type(value);
    }
  };

  var isNumber = lodash.isNumber;
  var number$1 = {
    type: Number,
    isCoerced: isNumber,
    default: 0,
    coerce: function coerce(value) {
      return this.type(value);
    }
  };

  var isBoolean = lodash.isBoolean;
  var boolean_1$1 = {
    type: Boolean,
    isCoerced: isBoolean,
    default: false,
    coerce: function coerce(value) {
      return this.type(value);
    }
  };

  var isDate = lodash.isDate;
  var date$1 = {
    type: Date,
    isCoerced: isDate,
    default: function _default() {
      return new Date(null);
    },
    coerce: function coerce(value) {
      return new this.type(value);
    }
  };

  var types = [string$1, number$1, boolean_1$1, date$1];

  var for_1 = function coercionFor(typeDescriptor, itemTypeDescriptor) {
    if (itemTypeDescriptor) {
      return array$1(typeDescriptor, itemTypeDescriptor);
    }

    var coercion$1 = getCoercion(typeDescriptor);
    return coercion.execute(coercion$1, typeDescriptor);
  };

  function getCoercion(typeDescriptor) {
    var coercion = types.find(function (c) {
      return c.type === typeDescriptor.type;
    });

    if (coercion) {
      return coercion;
    }

    return generic;
  }

  var coercion$1 = {
    for: for_1
  };

  var isObject = lodash.isObject,
      isFunction$2 = lodash.isFunction,
      isString$1 = lodash.isString;

  function normalizeTypeDescriptor(schemaOptions, typeDescriptor, attributeName) {
    if (isShorthandTypeDescriptor(typeDescriptor)) {
      typeDescriptor = convertToCompleteTypeDescriptor(typeDescriptor);
    }

    validateTypeDescriptor(typeDescriptor, attributeName);
    return normalizeCompleteTypeDescriptor(schemaOptions, typeDescriptor, attributeName);
  }

  function normalizeCompleteTypeDescriptor(schemaOptions, typeDescriptor, attributeName) {
    if (isDynamicTypeDescriptor(typeDescriptor)) {
      typeDescriptor = addDynamicTypeGetter(schemaOptions, typeDescriptor, attributeName);
    }

    if (isArrayType(typeDescriptor)) {
      typeDescriptor.itemType = normalizeTypeDescriptor(schemaOptions, typeDescriptor.itemType, 'itemType');
    }

    return createNormalizedTypeDescriptor(typeDescriptor);
  }

  function createNormalizedTypeDescriptor(typeDescriptor) {
    return Object.assign({}, typeDescriptor, {
      coerce: coercion$1.for(typeDescriptor, typeDescriptor.itemType),
      validation: validation.forAttribute(typeDescriptor)
    });
  }

  function validateTypeDescriptor(typeDescriptor, attributeName) {
    if (!isObject(typeDescriptor.type) && !isDynamicTypeDescriptor(typeDescriptor)) {
      throw errors.invalidType(attributeName);
    }
  }

  function isDynamicTypeDescriptor(typeDescriptor) {
    return isString$1(typeDescriptor.type);
  }

  function addDynamicTypeGetter(schemaOptions, typeDescriptor, attributeName) {
    if (!hasDynamicType(schemaOptions, typeDescriptor)) {
      throw errors.missingDynamicType(attributeName);
    }

    typeDescriptor.getType = schemaOptions.dynamics[typeDescriptor.type];
    typeDescriptor.dynamicType = true;
    return typeDescriptor;
  }

  function isShorthandTypeDescriptor(typeDescriptor) {
    return isFunction$2(typeDescriptor) || isString$1(typeDescriptor);
  }

  function convertToCompleteTypeDescriptor(typeDescriptor) {
    return {
      type: typeDescriptor
    };
  }

  function hasDynamicType(schemaOptions, typeDescriptor) {
    return schemaOptions.dynamics && schemaOptions.dynamics[typeDescriptor.type];
  }

  function isArrayType(typeDescriptor) {
    return typeDescriptor.itemType != null;
  }

  var normalize = normalizeTypeDescriptor;
  var typeDescriptor = {
    normalize: normalize
  };

  var VALIDATE$1 = symbols.VALIDATE;

  var normalization = function normalizeSchema(rawSchema, schemaOptions) {
    var schema = Object.create(null);
    Object.keys(rawSchema).forEach(function (attributeName) {
      schema[attributeName] = typeDescriptor.normalize(schemaOptions, rawSchema[attributeName], attributeName);
    });
    var schemaValidation = validation.forSchema(schema);
    Object.defineProperty(schema, VALIDATE$1, {
      value: schemaValidation
    });
    return schema;
  };

  var schema = {
    normalize: normalization
  };

  var SCHEMA$2 = symbols.SCHEMA;

  function serialize(structure) {
    if (structure === undefined) {
      return;
    }

    var schema = structure[SCHEMA$2];
    return serializeStructure(structure, schema);
  }

  function getTypeSchema(typeDescriptor) {
    return typeResolver(typeDescriptor)[SCHEMA$2];
  }

  function serializeStructure(structure, schema) {
    var serializedStructure = Object.create(null);

    for (var attrName in schema) {
      var attribute = structure[attrName];

      if (attribute != null) {
        serializedStructure[attrName] = serializeAttribute(attribute, attrName, schema);
      }
    }

    return serializedStructure;
  }

  function serializeAttribute(attribute, attrName, schema) {
    if (isArrayType$1(schema, attrName)) {
      return attribute.map(serialize);
    }

    if (isNestedSchema(schema, attrName)) {
      return serialize(attribute);
    }

    return attribute;
  }

  function isArrayType$1(schema, attrName) {
    return schema[attrName].itemType && getTypeSchema(schema[attrName].itemType);
  }

  function isNestedSchema(schema, attrName) {
    return getTypeSchema(schema[attrName]);
  }

  var serialize_1 = serialize;

  var descriptor = {
    value: function toJSON() {
      return serialize_1(this);
    }
  };

  var serialization = {
    descriptor: descriptor
  };

  var isFunction$3 = lodash.isFunction;
  var nativesInitializer = Object.assign({}, {
    getValue: function getValue(attrDescriptor) {
      return attrDescriptor.default;
    },
    shouldInitialize: function shouldInitialize(attrDescriptor) {
      return !isFunction$3(attrDescriptor.default);
    }
  });
  var derivedInitializer = Object.assign({}, {
    getValue: function getValue(attrDescriptor, instance) {
      return attrDescriptor.default(instance);
    },
    shouldInitialize: function shouldInitialize(attrDescriptor) {
      return isFunction$3(attrDescriptor.default);
    }
  });

  function initialize(attributes, schema, instance) {
    var initializedAttributes = {};
    initializedAttributes = initializeWith(nativesInitializer, attributes, schema, initializedAttributes);
    initializedAttributes = initializeWith(derivedInitializer, attributes, schema, initializedAttributes);
    return instance.attributes = initializedAttributes;
  }

  function initializeWith(initializer, attributes, schema, initializedAttributes) {
    for (var attrName in schema) {
      var value = attributes[attrName];

      if (value !== undefined) {
        continue;
      }

      if (initializer.shouldInitialize(schema[attrName])) {
        attributes[attrName] = initializer.getValue(schema[attrName], initializedAttributes);
      }
    }

    return attributes;
  }

  var initializer = {
    initialize: initialize,
    nativesInitializer: nativesInitializer,
    derivedInitializer: derivedInitializer
  };

  var isObject$1 = lodash.isObject;
  var ATTRIBUTES = symbols.ATTRIBUTES;

  var attributeDescriptorFor = function attributeDescriptorFor(attributeName, schema) {
    return {
      enumerable: true,
      get: function get() {
        return this.attributes[attributeName];
      },
      set: function set(value) {
        this.attributes[attributeName] = schema[attributeName].coerce(value);
      }
    };
  };

  var attributesDescriptorFor = function attributesDescriptorFor(schema) {
    return {
      get: function get() {
        return this[ATTRIBUTES];
      },
      set: function set(newAttributes) {
        if (!isObject$1(newAttributes)) {
          throw errors.nonObjectAttributes();
        }

        var attributes = coerceAttributes(newAttributes, schema);
        Object.defineProperty(this, ATTRIBUTES, {
          configurable: true,
          value: attributes
        });
      }
    };
  };

  function coerceAttributes(newAttributes, schema) {
    var attributes = Object.create(null);

    for (var attrName in schema) {
      attributes[attrName] = schema[attrName].coerce(newAttributes[attrName]);
    }

    return attributes;
  }

  var descriptors$1 = {
    attributeDescriptorFor: attributeDescriptorFor,
    attributesDescriptorFor: attributesDescriptorFor
  };

  var SCHEMA$3 = symbols.SCHEMA;
  var attributeDescriptorFor$1 = descriptors$1.attributeDescriptorFor,
      attributesDescriptorFor$1 = descriptors$1.attributesDescriptorFor;
  var define = Object.defineProperty;

  function attributesDecorator(schema$1) {
    var schemaOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (_typeof(schemaOptions) !== 'object') {
      throw errors.classAsSecondParam(schemaOptions);
    }

    return function decorator(Class) {
      var WrapperClass = new Proxy(Class, {
        construct: function construct(target, constructorArgs, newTarget) {
          var instance = Reflect.construct(target, constructorArgs, newTarget);
          var passedAttributes = Object.assign({}, constructorArgs[0]);
          initializer.initialize(passedAttributes, schema$1, instance);
          return instance;
        }
      });

      if (WrapperClass[SCHEMA$3]) {
        schema$1 = Object.assign({}, WrapperClass[SCHEMA$3], schema$1);
      }

      schema$1 = schema.normalize(schema$1, schemaOptions);
      define(WrapperClass, SCHEMA$3, {
        value: schema$1
      });
      define(WrapperClass, 'validate', validation.staticDescriptorFor(schema$1));
      define(WrapperClass.prototype, SCHEMA$3, {
        value: schema$1
      });
      define(WrapperClass.prototype, 'attributes', attributesDescriptorFor$1(schema$1));
      Object.keys(schema$1).forEach(function (attr) {
        define(WrapperClass.prototype, attr, attributeDescriptorFor$1(attr, schema$1));
      });
      define(WrapperClass.prototype, 'validate', validation.descriptorFor(schema$1));
      define(WrapperClass.prototype, 'toJSON', serialization.descriptor);
      return WrapperClass;
    };
  }

  var decorator = attributesDecorator;

  var attributes = decorator;

  var src = {
    attributes: attributes
  };
  var src_1 = src.attributes;

  exports.attributes = src_1;
  exports.default = src;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
