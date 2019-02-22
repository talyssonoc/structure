const joi = require('joi');
const { isPlainObject, isFunction } = require('lodash');

exports.mapToJoi = function mapToJoi(typeDescriptor, { initial, mappings }) {
  return mappings.reduce((joiSchema, [optionName, joiMethod, passValueToJoi]) => {
    const attributeDescriptor = typeDescriptor[optionName];

    if(attributeDescriptor === undefined) {
      return joiSchema;
    }

    if(passValueToJoi && (!isFunction(passValueToJoi) || passValueToJoi(attributeDescriptor))) {
      return joiSchema[joiMethod](attributeDescriptor);
    }

    return joiSchema[joiMethod]();
  }, initial);
};

function mapValueOrReference(valueOrReference) {
  if(isPlainObject(valueOrReference)) {
    return joi.ref(valueOrReference.attr);
  }

  return valueOrReference;
}

exports.mapToJoiWithReference = function mapToJoiWithReference(typeDescriptor, { initial, mappings }) {
  return mappings.reduce((joiSchema, [optionName, joiMethod]) => {
    var attributeDescriptor = typeDescriptor[optionName];

    if(attributeDescriptor === undefined) {
      return joiSchema;
    }

    attributeDescriptor = mapValueOrReference(attributeDescriptor);

    return joiSchema[joiMethod](attributeDescriptor);
  }, initial);
};

exports.equalOption = function equalOption(typeDescriptor, { initial }) {
  var possibilities = typeDescriptor.equal;

  if(possibilities === undefined) {
    return initial;
  }

  if(Array.isArray(possibilities)) {
    possibilities = possibilities.map(mapValueOrReference);
  } else {
    possibilities = mapValueOrReference(possibilities);
  }

  return initial.equal(possibilities);
};

exports.requiredOption = function requiredOption(typeDescriptor, { initial }) {
  if(typeDescriptor.required) {
    return initial.required();
  }

  return initial;
};
