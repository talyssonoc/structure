const FUNCTION_TYPE = 'function';

module.exports = function getInitialValues(attributes, schema, instance) {
  for(let attr in schema) {
    attributes[attr] = (
      attributes[attr] === undefined
      ? getValue(schema[attr].default, instance)
      : attributes[attr]
    );
  }

  return attributes;
};

function getValue(value, instance) {
  if(typeof value === FUNCTION_TYPE) {
    return value(instance);
  }

  return value;
}
