const { isBoolean } = require('lodash');

module.exports = {
  type: Boolean,
  isCoerced: isBoolean,
  coerce(value) {
    return Boolean(value);
  }
};
