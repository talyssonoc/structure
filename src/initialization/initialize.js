const { INITIALIZE } = require('../symbols');

module.exports = function initialize(schema, attributes, instance) {
  schema[INITIALIZE].initialize(attributes, instance);
};
