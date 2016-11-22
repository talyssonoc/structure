exports.assignDefaultValue = (schema, instance) => {
  let values = {};

  for (let prop in schema) {
    const defaultDecl = schema[prop].default;

    if (defaultDecl) {
      values[prop] = typeof defaultDecl === 'function' ? defaultDecl(instance) : defaultDecl;
    }
  }

  return values;
};
