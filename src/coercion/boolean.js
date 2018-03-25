const { isBoolean } = require('lodash');

module.exports = {
  type: Boolean,
  test: isBoolean,
  coerce(value) {
    return Boolean(value);
  }
};
