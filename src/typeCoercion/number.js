const { isNumber } = require('lodash');

module.exports = {
  type: Number,
  test: isNumber,
  coerce(value) {
    if(value === null) {
      return 0;
    }

    return Number(value);
  }
};
