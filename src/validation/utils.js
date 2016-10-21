exports.mapToJoi = function mapToJoi (typeDescriptor, initialJoiSchema, joiMappings) {
  return joiMappings.reduce((joiSchema, [optionName, joiMethod, passValueToJoi]) => {
    if(typeDescriptor[optionName] === undefined) {
      return joiSchema;
    }

    if(passValueToJoi) {
      return joiSchema[joiMethod](typeDescriptor[optionName]);
    }

    return joiSchema[joiMethod]();
  }, initialJoiSchema);
};
