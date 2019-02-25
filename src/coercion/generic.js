const getType = require('../typeResolver');

module.exports = {
  isCoerced: function(value, typeDescriptor) {
    return value instanceof getType(typeDescriptor);
  },
  coerce(value, typeDescriptor) {
    const type = getType(typeDescriptor);

    return new type(value);
  }
};
