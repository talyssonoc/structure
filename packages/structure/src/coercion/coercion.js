const { isFunction } = require('lodash');

exports.create = function createCoercionFor(coercion, attributeDefinition) {
  return {
    coerce(value) {
      if (value === undefined) {
        return;
      }

      if (value === null) {
        return getNullableValue(coercion, attributeDefinition);
      }

      if (coercion.isCoerced(value, attributeDefinition)) {
        return value;
      }

      return coercion.coerce(value, attributeDefinition);
    },
  };
};

exports.disabled = {
  coerce: (value) => value,
};

const getNullableValue = (coercion, attributeDefinition) =>
  needsNullableInitialization(attributeDefinition) ? getNullValue(coercion) : null;

const needsNullableInitialization = (attributeDefinition) =>
  !attributeDefinition.options.required && !attributeDefinition.options.nullable;

const getNullValue = (coercion) =>
  isFunction(coercion.nullValue) ? coercion.nullValue() : coercion.nullValue;
