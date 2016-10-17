const _ = require('lodash');

const coercions = [
  {
    type: String,
    test: _.isString,
    coerce(value) {
      if(value == null) {
        return '';
      }

      return String(value);
    }
  }
];

module.exports = function coerce(Type, value) {
  const coercion = coercions.find((c) => c.type === Type);

  if(!coercion) {
    return value;
  }

  if(coercion.test(value)) {
    return value;
  }

  return coercion.coerce(value);
};
