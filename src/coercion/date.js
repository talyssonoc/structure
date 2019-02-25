const { isDate } = require('lodash');

module.exports = {
  type: Date,
  isCoerced: isDate,
  default: () => new Date(null),
  coerce(value) {
    return new this.type(value);
  }
};
