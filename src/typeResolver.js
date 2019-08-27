module.exports = function getAttributeType(typeDescriptor) {
  if (typeDescriptor.dynamicType) {
    return typeDescriptor.getType();
  }

  return typeDescriptor.type;
};
