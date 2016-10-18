const _ = require('lodash');

const types = [
  {
    type: String,
    test: _.isString,
    coerce(value) {
      if(value === null) {
        return '';
      }

      return String(value);
    }
  },

  {
    type: Number,
    test: _.isNumber,
    coerce(value) {
      if(value === null) {
        return 0;
      }

      return Number(value);
    }
  }
];

function genericCoercionFor(Type) {
  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    if(value instanceof Type) {
      return value;
    }

    return new Type(value);
  };
}

module.exports = {
  coercionFor(Type) {
    const coercion = types.find((c) => c.type === Type);

    if(!coercion) {
      return genericCoercionFor(Type);
    }

    return function coerce(value) {
      if(value === undefined) {
        return;
      }

      if(coercion.test(value)) {
        return value;
      }

      return coercion.coerce(value);
    };
  }
};
