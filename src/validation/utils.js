const joi = require('joi');
const { isPlainObject } = require('lodash');

exports.mapToJoi = function mapToJoi(typeDescriptor, { initial, mappings }) {
  return mappings.reduce((joiSchema, [optionName, joiMethod, passValueToJoi]) => {
    if(typeDescriptor[optionName] === undefined) {
      return joiSchema;
    }

    if(passValueToJoi) {
      return joiSchema[joiMethod](typeDescriptor[optionName]);
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
    var optionValue = typeDescriptor[optionName];

    if(optionValue === undefined) {
      return joiSchema;
    }

    optionValue = mapValueOrReference(optionValue);

    return joiSchema[joiMethod](optionValue);
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
