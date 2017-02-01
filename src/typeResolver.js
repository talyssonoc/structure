exports.getType = function getType(typeDescriptor) {
  if(typeDescriptor.dynamicType) {
    return typeDescriptor.getType();
  }

  return typeDescriptor.type;
};
