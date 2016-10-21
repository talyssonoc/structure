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

exports.mapToJoiWithReference = function mapToJoiWithReference(typeDescriptor, { initial, mappings }) {
  return mappings.reduce((joiSchema, [optionName, joiMethod]) => {
    var optionValue = typeDescriptor[optionName];

    if(optionValue === undefined) {
      return joiSchema;
    }

    if(isPlainObject(optionValue)) {
      optionValue = joi.ref(optionValue.attr);
    }

    return joiSchema[joiMethod](optionValue);
  }, initial);
};
