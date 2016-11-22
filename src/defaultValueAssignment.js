exports.retrieveDefaultValues = (schema, instance) => Object.keys(schema).reduce((values, prop) => {
  const defaultDecl = schema[prop].default;

  if (defaultDecl) {
    values[prop] = typeof defaultDecl === 'function' ? defaultDecl(instance) : defaultDecl;
  }

  return values;
}, {});
