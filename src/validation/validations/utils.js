const joi = require('@hapi/joi');
const { isPlainObject, isFunction } = require('lodash');

exports.mapToJoi = function mapToJoi(attributeDefinition, { initial, mappings }) {
  let joiSchema = mappings.reduce((joiSchema, [optionName, joiMethod, passValueToJoi]) => {
    const optionValue = attributeDefinition.options[optionName];

    if (optionValue === undefined) {
      return joiSchema;
    }

    if (shouldPassValueToJoi(passValueToJoi, optionValue)) {
      return joiSchema[joiMethod](optionValue);
    }

    return joiSchema[joiMethod]();
  }, initial);

  joiSchema = requiredOption(attributeDefinition, { initial: joiSchema });

  return joiSchema;
};

function shouldPassValueToJoi(passValueToJoi, optionValue) {
  return passValueToJoi && (!isFunction(passValueToJoi) || passValueToJoi(optionValue));
}

function mapValueOrReference(valueOrReference) {
  if (isPlainObject(valueOrReference)) {
    return joi.ref(valueOrReference.attr);
  }

  return valueOrReference;
}

exports.mapToJoiWithReference = function mapToJoiWithReference(
  attributeDefinition,
  { initial, mappings }
) {
  return mappings.reduce((joiSchema, [optionName, joiMethod]) => {
    let optionValue = attributeDefinition.options[optionName];

    if (optionValue === undefined) {
      return joiSchema;
    }

    optionValue = mapValueOrReference(optionValue);

    return joiSchema[joiMethod](optionValue);
  }, initial);
};

exports.equalOption = function equalOption(attributeDefinition, { initial }) {
  let possibilities = attributeDefinition.options.equal;

  if (possibilities === undefined) {
    return initial;
  }

  if (!Array.isArray(possibilities)) {
    possibilities = [possibilities];
  }

  possibilities = possibilities.map(mapValueOrReference);

  return initial.equal(...possibilities);
};

function requiredOption(attributeDefinition, { initial }) {
  if (attributeDefinition.options.nullable) {
    initial = initial.allow(null);
  }

  if (attributeDefinition.options.required) {
    initial = initial.required();
  }

  return initial;
}

exports.requiredOption = requiredOption;
