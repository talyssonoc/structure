const { isObject, isFunction, isString } = require('lodash');
const Errors = require('../errors');
const Coercion = require('../coercion');
const Validation = require('../validation');

function normalizeTypeDescriptor(schemaOptions, typeDescriptor, attributeName) {
  if (isShorthandTypeDescriptor(typeDescriptor)) {
    typeDescriptor = convertToCompleteTypeDescriptor(typeDescriptor);
  }

  validateTypeDescriptor(typeDescriptor, attributeName);

  return normalizeCompleteTypeDescriptor(
    schemaOptions,
    typeDescriptor,
    attributeName
  );
}

function normalizeCompleteTypeDescriptor(
  schemaOptions,
  typeDescriptor,
  attributeName
) {
  if (isDynamicTypeDescriptor(typeDescriptor)) {
    typeDescriptor = addDynamicTypeGetter(
      schemaOptions,
      typeDescriptor,
      attributeName
    );
  }

  if (isArrayType(typeDescriptor)) {
    typeDescriptor.itemType = normalizeTypeDescriptor(
      schemaOptions,
      typeDescriptor.itemType,
      'itemType'
    );
  }

  return createNormalizedTypeDescriptor(typeDescriptor);
}

function createNormalizedTypeDescriptor(typeDescriptor) {
  return Object.assign({}, typeDescriptor, {
    coerce: Coercion.for(typeDescriptor, typeDescriptor.itemType),
    validation: Validation.forAttribute(typeDescriptor),
  });
}

function validateTypeDescriptor(typeDescriptor, attributeName) {
  if (
    !isObject(typeDescriptor.type) &&
    !isDynamicTypeDescriptor(typeDescriptor)
  ) {
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
