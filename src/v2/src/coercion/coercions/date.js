const { isDate } = require('lodash');

module.exports = {
  type: Date,
  isCoerced: isDate,
  nullValue: () => new Date(null),
  coerce(value) {
    return new this.type(value);
  },
};
