const joi = require('joi');
const { isPlainObject, isFunction } = require('lodash');

exports.mapToJoi = function mapToJoi(typeDescriptor, { initial, mappings }) {
  let joiSchema = mappings.reduce(
    (joiSchema, [optionName, joiMethod, passValueToJoi]) => {
      const attributeDescriptor = typeDescriptor[optionName];
      if (attributeDescriptor === undefined) {
        return joiSchema;
      }

      if (shouldPassValueToJoi(passValueToJoi, attributeDescriptor)) {
        return joiSchema[joiMethod](attributeDescriptor);
      }

      return joiSchema[joiMethod]();
    },
    initial
  );

  joiSchema = requiredOption(typeDescriptor, { initial: joiSchema });

  return joiSchema;
};

function shouldPassValueToJoi(passValueToJoi, attributeDescriptor) {
  return (
    passValueToJoi &&
    (!isFunction(passValueToJoi) || passValueToJoi(attributeDescriptor))
  );
}

function mapValueOrReference(valueOrReference) {
  if (isPlainObject(valueOrReference)) {
    return joi.ref(valueOrReference.attr);
  }

  return valueOrReference;
}

exports.mapToJoiWithReference = function mapToJoiWithReference(
  typeDescriptor,
  { initial, mappings }
) {
  return mappings.reduce((joiSchema, [optionName, joiMethod]) => {
    var attributeDescriptor = typeDescriptor[optionName];

    if (attributeDescriptor === undefined) {
      return joiSchema;
    }

    attributeDescriptor = mapValueOrReference(attributeDescriptor);

    return joiSchema[joiMethod](attributeDescriptor);
  }, initial);
};

exports.equalOption = function equalOption(typeDescriptor, { initial }) {
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

function requiredOption(typeDescriptor, { initial }) {
  if (typeDescriptor.nullable) {
    initial = initial.allow(null);
  }

  if (typeDescriptor.required) {
    initial = initial.required();
  }

  return initial;
}

exports.requiredOption = requiredOption;
