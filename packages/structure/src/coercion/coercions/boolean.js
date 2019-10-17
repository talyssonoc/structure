const { isBoolean } = require('lodash');

module.exports = {
  type: Boolean,
  isCoerced: isBoolean,
  nullValue: false,
  coerce(value) {
    return this.type(value);
  },
};
