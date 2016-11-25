function getValue(value, instance) {
  if(typeof value === 'function') {
    return value(instance);
  }

  return value;
}

exports.assignAttributesValues = (attributes, schema, instance) => {

  for(let attr in schema) {
    attributes[attr] = (attributes[attr] === undefined ? getValue(schema[attr].default, instance) : attributes[attr]);
  }

  return attributes;
};
