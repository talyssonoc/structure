function getValue(value, instance) {
  if(typeof value === 'function') {
    return value(instance);
  }

  return value;
}

function getInitialValues(attributes, schema, instance) {
  for(let attr in schema) {
    attributes[attr] = (
      attributes[attr] === undefined
      ? getValue(schema[attr].default, instance)
      : attributes[attr]
    );
  }

  return attributes;
}

exports.getInitialValues = getInitialValues;
