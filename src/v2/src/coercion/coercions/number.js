const { isNumber } = require('lodash');

module.exports = {
  type: Number,
  isCoerced: isNumber,
  nullValue: 0,
  coerce(value) {
    return this.type(value);
  },
};
