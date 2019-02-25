const { isNumber } = require('lodash');

module.exports = {
  type: Number,
  isCoerced: isNumber,
  coerce(value) {
    if(value === null) {
      return 0;
    }

    return Number(value);
  }
};
