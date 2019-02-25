const { isString } = require('lodash');

module.exports = {
  type: String,
  isCoerced: isString,
  default: '',
  coerce(value) {
    return this.type(value);
  }
};
