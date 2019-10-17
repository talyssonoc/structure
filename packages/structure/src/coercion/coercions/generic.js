module.exports = {
  isCoerced(value, attributeDefinition) {
    return value instanceof attributeDefinition.resolveType();
  },
  coerce(value, attributeDefinition) {
    const type = attributeDefinition.resolveType();

    return new type(value);
  },
};
