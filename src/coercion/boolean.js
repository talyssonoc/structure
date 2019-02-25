const { isBoolean } = require('lodash');

module.exports = {
  type: Boolean,
  isCoerced: isBoolean,
  default: false,
  coerce(value) {
    return this.type(value);
  }
};
