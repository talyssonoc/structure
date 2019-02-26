const { isNumber } = require('lodash');

module.exports = {
  type: Number,
  isCoerced: isNumber,
  default: 0,
  coerce(value) {
    return this.type(value);
  }
};
