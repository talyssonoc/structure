const { isString } = require('lodash');

module.exports = {
  type: String,
  isCoerced: isString,
  coerce(value) {
    if(value === null) {
      return '';
    }

    return String(value);
  }
};
