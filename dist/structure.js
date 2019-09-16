(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("joi"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define("Structure", ["joi", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["Structure"] = factory(require("joi"), require("lodash"));
	else
		root["Structure"] = factory(root["joi"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  attributes: __webpack_require__(2)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Schema = __webpack_require__(4);
	var Serialization = __webpack_require__(33);
	var Validation = __webpack_require__(6);
	var Initialization = __webpack_require__(18);
	var StrictMode = __webpack_require__(36);
	var Errors = __webpack_require__(23);

	var _require = __webpack_require__(15),
	    SCHEMA = _require.SCHEMA;

	var _require2 = __webpack_require__(38),
	    attributeDescriptorFor = _require2.attributeDescriptorFor,
	    attributesDescriptorFor = _require2.attributesDescriptorFor;

	var Cloning = __webpack_require__(39);

	var define = Object.defineProperty;

	function attributesDecorator(schema) {
	  var schemaOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if ((typeof schemaOptions === 'undefined' ? 'undefined' : _typeof(schemaOptions)) !== 'object') {
	    throw Errors.classAsSecondParam(schemaOptions);
	  }

	  return function decorator(Class) {
	    var WrapperClass = new Proxy(Class, {
	      construct: function construct(target, constructorArgs, newTarget) {
	        var instance = Reflect.construct(target, constructorArgs, newTarget);
	        var passedAttributes = Object.assign({}, constructorArgs[0]);

	        Initialization.initialize(schema, passedAttributes, instance);

	        return instance;
	      }
	    });

	    if (WrapperClass[SCHEMA]) {
	      schema = Object.assign({}, WrapperClass[SCHEMA], schema);
	    }

	    schema = Schema.normalize(schema, schemaOptions);

	    define(WrapperClass, SCHEMA, {
	      value: schema
	    });

	    define(WrapperClass, 'validate', Validation.staticDescriptorFor(schema));

	    define(WrapperClass.prototype, SCHEMA, {
	      value: schema
	    });

	    define(WrapperClass.prototype, 'attributes', attributesDescriptorFor(schema));

	    define(WrapperClass.prototype, 'validate', Validation.descriptorFor(schema));

	    define(WrapperClass.prototype, 'toJSON', Serialization.descriptor);

	    define(WrapperClass, 'buildStrict', StrictMode.buildStrictDescriptorFor(WrapperClass, schemaOptions));

	    define(WrapperClass.prototype, 'clone', Cloning.buildCloneDescriptorFor(WrapperClass));

	    Object.keys(schema).forEach(function (attr) {
	      define(WrapperClass.prototype, attr, attributeDescriptorFor(attr, schema));
	    });

	    return WrapperClass;
	  };
	}

	module.exports = attributesDecorator;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  normalize: __webpack_require__(5)
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Validation = __webpack_require__(6);
	var Initialization = __webpack_require__(18);
	var TypeDescriptor = __webpack_require__(22);

	var _require = __webpack_require__(15),
	    VALIDATE = _require.VALIDATE,
	    INITIALIZE = _require.INITIALIZE;

	module.exports = function normalizeSchema(rawSchema, schemaOptions) {
	  var schema = Object.create(null);

	  Object.keys(rawSchema).forEach(function (attributeName) {
	    schema[attributeName] = TypeDescriptor.normalize(schemaOptions, rawSchema[attributeName], attributeName);
	  });

	  var schemaValidation = Validation.forSchema(schema);

	  Object.defineProperty(schema, VALIDATE, {
	    value: schemaValidation
	  });

	  var initialization = Initialization.forSchema(schema);

	  Object.defineProperty(schema, INITIALIZE, {
	    value: initialization
	  });

	  return schema;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var validations = [__webpack_require__(8), __webpack_require__(11), __webpack_require__(12), __webpack_require__(13)];

	var nestedValidation = __webpack_require__(14);
	var arrayValidation = __webpack_require__(16);

	var _require = __webpack_require__(17),
	    validationDescriptorForSchema = _require.validationDescriptorForSchema,
	    staticValidationDescriptorForSchema = _require.staticValidationDescriptorForSchema;

	exports.descriptorFor = validationDescriptorForSchema;
	exports.staticDescriptorFor = staticValidationDescriptorForSchema;

	exports.forAttribute = function validationForAttribute(typeDescriptor) {
	  if (typeDescriptor.itemType !== undefined) {
	    return arrayValidation(typeDescriptor, typeDescriptor.itemType);
	  }

	  var validation = validations.find(function (v) {
	    return v.type === typeDescriptor.type;
	  });

	  if (!validation) {
	    return nestedValidation(typeDescriptor);
	  }

	  return validation.createJoiSchema(typeDescriptor);
	};

	var mapDetail = function mapDetail(_ref) {
	  var message = _ref.message,
	      path = _ref.path;
	  return { message: message, path: path };
	};

	var validatorOptions = {
	  abortEarly: false,
	  convert: false,
	  allowUnknown: false
	};

	exports.forSchema = function validationForSchema(schema) {
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(9),
	    isPlainObject = _require.isPlainObject;

	var _require2 = __webpack_require__(10),
	    mapToJoi = _require2.mapToJoi,
	    equalOption = _require2.equalOption;

	module.exports = {
	  type: String,
	  joiMappings: [['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true], ['regex', 'regex', true], ['alphanumeric', 'alphanum'], ['lowerCase', 'lowercase'], ['upperCase', 'uppercase'], ['email', 'email'], ['guid', 'guid', isPlainObject]],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = joi.string();

	    if (typeDescriptor.empty) {
	      joiSchema = joiSchema.allow('');
	    }

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, {
	      initial: joiSchema,
	      mappings: this.joiMappings
	    });
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(9),
	    isPlainObject = _require.isPlainObject,
	    isFunction = _require.isFunction;

	exports.mapToJoi = function mapToJoi(typeDescriptor, _ref) {
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

	  joiSchema = requiredOption(typeDescriptor, { initial: joiSchema });

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

	exports.mapToJoiWithReference = function mapToJoiWithReference(typeDescriptor, _ref4) {
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

	exports.equalOption = function equalOption(typeDescriptor, _ref7) {
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

	  if (typeDescriptor.nullable) {
	    initial = initial.allow(null);
	  }

	  if (typeDescriptor.required) {
	    initial = initial.required();
	  }

	  return initial;
	}

	exports.requiredOption = requiredOption;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(10),
	    mapToJoi = _require.mapToJoi,
	    mapToJoiWithReference = _require.mapToJoiWithReference,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Number,
	  joiMappings: [['integer', 'integer'], ['precision', 'precision', true], ['multiple', 'multiple', true], ['positive', 'positive', true], ['negative', 'negative', true]],
	  valueOrRefOptions: [['min', 'min'], ['greater', 'greater'], ['max', 'max'], ['less', 'less']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = mapToJoiWithReference(typeDescriptor, {
	      initial: joi.number(),
	      mappings: this.valueOrRefOptions
	    });

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, {
	      initial: joiSchema,
	      mappings: this.joiMappings
	    });
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(10),
	    mapToJoi = _require.mapToJoi,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Boolean,
	  joiMappings: [],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = joi.boolean();

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, {
	      initial: joiSchema,
	      mappings: this.joiMappings
	    });
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(10),
	    mapToJoi = _require.mapToJoi,
	    mapToJoiWithReference = _require.mapToJoiWithReference,
	    equalOption = _require.equalOption;

	module.exports = {
	  type: Date,
	  joiMappings: [],
	  valueOrRefOptions: [['min', 'min'], ['max', 'max']],
	  createJoiSchema: function createJoiSchema(typeDescriptor) {
	    var joiSchema = mapToJoiWithReference(typeDescriptor, {
	      initial: joi.date(),
	      mappings: this.valueOrRefOptions
	    });

	    joiSchema = equalOption(typeDescriptor, { initial: joiSchema });

	    return mapToJoi(typeDescriptor, {
	      initial: joiSchema,
	      mappings: this.joiMappings
	    });
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(15),
	    SCHEMA = _require.SCHEMA;

	var _require2 = __webpack_require__(10),
	    requiredOption = _require2.requiredOption;

	module.exports = function nestedValidation(typeDescriptor) {
	  if (typeDescriptor.dynamicType) {
	    return validationToDynamicType(typeDescriptor);
	  }

	  var typeSchema = typeDescriptor.type[SCHEMA];
	  var joiSchema = getNestedValidations(typeSchema);

	  joiSchema = requiredOption(typeDescriptor, {
	    initial: joiSchema
	  });

	  return joiSchema;
	};

	function validationToDynamicType(typeDescriptor) {
	  var joiSchema = joi.lazy(function () {
	    var typeSchema = typeDescriptor.getType()[SCHEMA];

	    return getNestedValidations(typeSchema);
	  });

	  joiSchema = requiredOption(typeDescriptor, {
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

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  SCHEMA: Symbol('schema'),
	  ATTRIBUTES: Symbol('attributes'),
	  VALIDATE: Symbol('validate'),
	  INITIALIZE: Symbol('initialize')
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var joi = __webpack_require__(7);

	var _require = __webpack_require__(10),
	    mapToJoi = _require.mapToJoi;

	var joiMappings = [['minLength', 'min', true], ['maxLength', 'max', true], ['exactLength', 'length', true], ['unique', 'unique']];

	module.exports = function arrayValidation(typeDescriptor, itemTypeDescriptor) {
	  var joiSchema = joi.array().items(itemTypeDescriptor.validation);
	  var canBeSparse = typeDescriptor.sparse === undefined || typeDescriptor.sparse;

	  joiSchema = joiSchema.sparse(canBeSparse);

	  joiSchema = mapToJoi(typeDescriptor, {
	    initial: joiSchema,
	    mappings: joiMappings
	  });

	  return joiSchema;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(15),
	    SCHEMA = _require.SCHEMA,
	    VALIDATE = _require.VALIDATE;

	exports.validationDescriptorForSchema = function validationDescriptorForSchema(schema) {
	  var validation = schema[VALIDATE];

	  return {
	    value: function validate() {
	      var serializedStructure = this.toJSON();

	      return validateData(validation, serializedStructure);
	    }
	  };
	};

	exports.staticValidationDescriptorForSchema = function staticValidationDescriptorForSchema(schema) {
	  var validation = schema[VALIDATE];

	  return {
	    value: function validate(data) {
	      if (data[SCHEMA]) {
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

	  return { valid: true };
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  forSchema: __webpack_require__(19),
	  initialize: __webpack_require__(21)
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _require = __webpack_require__(15),
	    ATTRIBUTES = _require.ATTRIBUTES;

	var initializationOrderFor = __webpack_require__(20);

	function initializedValue(attrPassedValue, attrInitializer, attrDescriptor, instance) {
	  if (attrPassedValue !== undefined) {
	    return attrPassedValue;
	  }

	  return attrInitializer(attrDescriptor, instance);
	}

	module.exports = function forSchema(schema) {
	  var initializationOrder = initializationOrderFor(schema);

	  return {
	    initialize: function initialize(attributes, instance) {
	      instance[ATTRIBUTES] = Object.create(null);

	      for (var i = 0; i < initializationOrder.length; i++) {
	        var _initializationOrder$ = _slicedToArray(initializationOrder[i], 2),
	            attrName = _initializationOrder$[0],
	            attrInitializer = _initializationOrder$[1];

	        var attrDescriptor = schema[attrName];
	        var attrPassedValue = attributes[attrName];

	        instance[attrName] = initializedValue(attrPassedValue, attrInitializer, attrDescriptor, instance);
	      }
	    }
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isFunction = _require.isFunction;

	function isStaticInitialization(attrDescriptor) {
	  return !isFunction(attrDescriptor.default);
	}

	function staticInitialization(attrDescriptor) {
	  return attrDescriptor.default;
	}

	function derivedInitialization(attrDescriptor, instance) {
	  return attrDescriptor.default(instance);
	}

	module.exports = function initializationOrderFor(schema) {
	  var staticInitializations = [];
	  var derivedInitializations = [];

	  for (var attrName in schema) {
	    var attributeDescriptor = schema[attrName];

	    if (isStaticInitialization(attributeDescriptor)) {
	      staticInitializations.push([attrName, staticInitialization]);
	    } else {
	      derivedInitializations.push([attrName, derivedInitialization]);
	    }
	  }

	  return [].concat(staticInitializations, derivedInitializations);
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(15),
	    INITIALIZE = _require.INITIALIZE;

	module.exports = function initialize(schema, attributes, instance) {
	  schema[INITIALIZE].initialize(attributes, instance);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isObject = _require.isObject,
	    isFunction = _require.isFunction,
	    isString = _require.isString;

	var Errors = __webpack_require__(23);
	var Coercion = __webpack_require__(24);
	var Validation = __webpack_require__(6);

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
	    coerce: Coercion.for(typeDescriptor, typeDescriptor.itemType),
	    validation: Validation.forAttribute(typeDescriptor)
	  });
	}

	function validateTypeDescriptor(typeDescriptor, attributeName) {
	  if (!isObject(typeDescriptor.type) && !isDynamicTypeDescriptor(typeDescriptor)) {
	    throw Errors.invalidType(attributeName);
	  }
	}

	function isDynamicTypeDescriptor(typeDescriptor) {
	  return isString(typeDescriptor.type);
	}

	function addDynamicTypeGetter(schemaOptions, typeDescriptor, attributeName) {
	  if (!hasDynamicType(schemaOptions, typeDescriptor)) {
	    throw Errors.missingDynamicType(attributeName);
	  }

	  typeDescriptor.getType = schemaOptions.dynamics[typeDescriptor.type];
	  typeDescriptor.dynamicType = true;

	  return typeDescriptor;
	}

	function isShorthandTypeDescriptor(typeDescriptor) {
	  return isFunction(typeDescriptor) || isString(typeDescriptor);
	}

	function convertToCompleteTypeDescriptor(typeDescriptor) {
	  return { type: typeDescriptor };
	}

	function hasDynamicType(schemaOptions, typeDescriptor) {
	  return schemaOptions.dynamics && schemaOptions.dynamics[typeDescriptor.type];
	}

	function isArrayType(typeDescriptor) {
	  return typeDescriptor.itemType != null;
	}

	exports.normalize = normalizeTypeDescriptor;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	exports.classAsSecondParam = function (ErroneousPassedClass) {
	  return new Error('You passed the structure class as the second parameter of attributes(). The expected usage is `attributes(schema)(' + (ErroneousPassedClass.name || 'StructureClass') + ')`.');
	};

	exports.nonObjectAttributes = function () {
	  return new TypeError("#attributes can't be set to a non-object.");
	};

	exports.arrayOrIterable = function () {
	  return new TypeError('Value must be iterable or array-like.');
	};

	exports.missingDynamicType = function (attributeName) {
	  return new Error('Missing dynamic type for attribute: ' + attributeName + '.');
	};

	exports.invalidType = function (attributeName) {
	  return new TypeError('Attribute type must be a constructor or the name of a dynamic type: ' + attributeName + '.');
	};

	exports.invalidAttributes = function (errors, StructureValidationError) {
	  return new StructureValidationError(errors);
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayCoercionFor = __webpack_require__(25);
	var genericCoercionFor = __webpack_require__(27);
	var Coercion = __webpack_require__(28);

	var types = [__webpack_require__(29), __webpack_require__(30), __webpack_require__(31), __webpack_require__(32)];

	exports.for = function coercionFor(typeDescriptor, itemTypeDescriptor) {
	  if (itemTypeDescriptor) {
	    return arrayCoercionFor(typeDescriptor, itemTypeDescriptor);
	  }

	  var coercion = getCoercion(typeDescriptor);

	  return Coercion.execute(coercion, typeDescriptor);
	};

	function getCoercion(typeDescriptor) {
	  var coercion = types.find(function (c) {
	    return c.type === typeDescriptor.type;
	  });

	  if (coercion) {
	    return coercion;
	  }

	  return genericCoercionFor;
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var Errors = __webpack_require__(23);
	var getType = __webpack_require__(26);

	module.exports = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
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
	    throw Errors.arrayOrIterable();
	  }
	}

	function isIterable(value) {
	  return value != null && (value.length != null || value[Symbol.iterator]);
	}

	function extractItems(iterable) {
	  if (!Array.isArray(iterable) && iterable[Symbol.iterator]) {
	    return Array.apply(undefined, _toConsumableArray(iterable));
	  }

	  return iterable;
	}

	function createInstance(typeDescriptor) {
	  var type = getType(typeDescriptor);
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

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function getAttributeType(typeDescriptor) {
	  if (typeDescriptor.dynamicType) {
	    return typeDescriptor.getType();
	  }

	  return typeDescriptor.type;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getType = __webpack_require__(26);

	module.exports = {
	  isCoerced: function isCoerced(value, typeDescriptor) {
	    return value instanceof getType(typeDescriptor);
	  },
	  coerce: function coerce(value, typeDescriptor) {
	    var type = getType(typeDescriptor);

	    return new type(value);
	  }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isFunction = _require.isFunction,
	    curryRight = _require.curryRight;

	exports.execute = curryRight(function (value, coercion, typeDescriptor) {
	  if (value === undefined) {
	    return;
	  }

	  if (value === null) {
	    return getNullableValue(coercion, typeDescriptor);
	  }

	  if (coercion.isCoerced(value, typeDescriptor)) {
	    return value;
	  }

	  return coercion.coerce(value, typeDescriptor);
	});

	function getNullableValue(coercion, typeDescriptor) {
	  return needsNullableInitialization(typeDescriptor) ? getNullValue(coercion) : null;
	}

	function needsNullableInitialization(typeDescriptor) {
	  return !typeDescriptor.required && !typeDescriptor.nullable;
	}

	function getNullValue(coercion) {
	  return isFunction(coercion.nullValue) ? coercion.nullValue() : coercion.nullValue;
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isString = _require.isString;

	module.exports = {
	  type: String,
	  isCoerced: isString,
	  nullValue: '',
	  coerce: function coerce(value) {
	    return this.type(value);
	  }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isNumber = _require.isNumber;

	module.exports = {
	  type: Number,
	  isCoerced: isNumber,
	  nullValue: 0,
	  coerce: function coerce(value) {
	    return this.type(value);
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isBoolean = _require.isBoolean;

	module.exports = {
	  type: Boolean,
	  isCoerced: isBoolean,
	  nullValue: false,
	  coerce: function coerce(value) {
	    return this.type(value);
	  }
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isDate = _require.isDate;

	module.exports = {
	  type: Date,
	  isCoerced: isDate,
	  nullValue: function nullValue() {
	    return new Date(null);
	  },
	  coerce: function coerce(value) {
	    return new this.type(value);
	  }
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  descriptor: __webpack_require__(34)
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var serialize = __webpack_require__(35);

	module.exports = {
	  value: function toJSON() {
	    return serialize(this);
	  }
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(15),
	    SCHEMA = _require.SCHEMA;

	var getType = __webpack_require__(26);

	function serialize(structure) {
	  if (structure == null) {
	    return structure;
	  }

	  var schema = structure[SCHEMA];

	  return serializeStructure(structure, schema);
	}

	function getTypeSchema(typeDescriptor) {
	  return getType(typeDescriptor)[SCHEMA];
	}

	function serializeStructure(structure, schema) {
	  var serializedStructure = Object.create(null);

	  for (var attrName in schema) {
	    var attribute = structure[attrName];

	    if (isPresent(attribute) || isNullable(attribute, schema, attrName)) {
	      serializedStructure[attrName] = serializeAttribute(attribute, attrName, schema);
	    }
	  }

	  return serializedStructure;
	}

	function isPresent(attribute) {
	  return attribute != null;
	}

	function isNullable(attribute, schema, attrName) {
	  return attribute !== undefined && schema[attrName].nullable;
	}

	function serializeAttribute(attribute, attrName, schema) {
	  if (isArrayType(schema, attrName)) {
	    return attribute.map(serialize);
	  }

	  if (isNestedSchema(schema, attrName)) {
	    return serialize(attribute);
	  }

	  return attribute;
	}

	function isArrayType(schema, attrName) {
	  return schema[attrName].itemType && getTypeSchema(schema[attrName].itemType);
	}

	function isNestedSchema(schema, attrName) {
	  return getTypeSchema(schema[attrName]);
	}

	module.exports = serialize;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Errors = __webpack_require__(23);
	var DefaultValidationError = __webpack_require__(37);

	exports.buildStrictDescriptorFor = function buildStrictDescriptorFor(StructureClass, schemaOptions) {
	  var StructureValidationError = schemaOptions.strictValidationErrorClass || DefaultValidationError;

	  return {
	    value: function buildStrict(constructorArgs) {
	      var instance = new StructureClass(constructorArgs);

	      var _instance$validate = instance.validate(),
	          valid = _instance$validate.valid,
	          errors = _instance$validate.errors;

	      if (!valid) {
	        throw Errors.invalidAttributes(errors, StructureValidationError);
	      }

	      return instance;
	    }
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DefautValidationError = function (_Error) {
	  _inherits(DefautValidationError, _Error);

	  function DefautValidationError(errors) {
	    _classCallCheck(this, DefautValidationError);

	    var _this = _possibleConstructorReturn(this, (DefautValidationError.__proto__ || Object.getPrototypeOf(DefautValidationError)).call(this, 'Invalid Attributes'));

	    _this.details = errors;
	    return _this;
	  }

	  return DefautValidationError;
	}(Error);

	module.exports = DefautValidationError;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(9),
	    isObject = _require.isObject;

	var Errors = __webpack_require__(23);

	var _require2 = __webpack_require__(15),
	    ATTRIBUTES = _require2.ATTRIBUTES;

	exports.attributeDescriptorFor = function attributeDescriptorFor(attributeName, schema) {
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

	exports.attributesDescriptorFor = function attributesDescriptorFor(schema) {
	  return {
	    get: function get() {
	      return this[ATTRIBUTES];
	    },
	    set: function set(newAttributes) {
	      if (!isObject(newAttributes)) {
	        throw Errors.nonObjectAttributes();
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

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	exports.buildCloneDescriptorFor = function buildCloneDescriptorFor(StructureClass) {
	  return {
	    configurable: true,
	    value: function clone() {
	      var overwrites = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var strict = options.strict;


	      var newAttributes = Object.assign({}, this.attributes, overwrites);

	      var cloneInstance = void 0;

	      if (strict) {
	        cloneInstance = StructureClass.buildStrict(newAttributes);
	      } else {
	        cloneInstance = new StructureClass(newAttributes);
	      }

	      return cloneInstance;
	    }
	  };
	};

/***/ }
/******/ ])
});
;