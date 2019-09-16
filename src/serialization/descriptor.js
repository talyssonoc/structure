const serialize = require('./serialize');

module.exports = {
  value: function toJSON() {
    return serialize(this);
  },
};
