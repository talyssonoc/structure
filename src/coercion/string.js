const { isString } = require('lodash');

module.exports = {
  type: String,
  isCoerced: isString,
  nullValue: '',
  coerce(value) {
    return this.type(value);
  },
};
