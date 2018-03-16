const FUNCTION_TYPE = 'function';

function natives(attributes, schema) {
  for(let attr in schema) {
    if (typeof schema[attr].default === FUNCTION_TYPE) {
      continue;
    }

    attributes[attr] = (
      attributes[attr] === undefined
      ? schema[attr].default
      : attributes[attr]
    );
  }

  return attributes;
}

function functions(attributes, schema, instance) {
  for(let attr in schema) {
    if (typeof schema[attr].default !== FUNCTION_TYPE) {
      continue;
    }

    attributes[attr] = (
      attributes[attr] === undefined
      ? schema[attr].default(instance)
      : attributes[attr]
    );
  }

  return attributes;
}

module.exports = { natives, functions };
