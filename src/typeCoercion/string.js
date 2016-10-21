const { isString } = require('lodash');

module.exports = {
  type: String,
  test: isString,
  coerce(value) {
    if(value === null) {
      return '';
    }

    return String(value);
  }
};
