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
  },

  {
    type: Boolean,
    coerce(value) {
      return Boolean(value);
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

function arrayCoercionFor(Type, ItemsType) {
  const itemsCoercion = coercionFor(ItemsType);

  return function coerceArray(value) {
    if(value === undefined) {
      return;
    }

    if(value === null || (value.length === undefined && !value[Symbol.iterator])) {
      throw new Error('Value must be an iterable.');
    }

    if(value[Symbol.iterator]) {
      value = Array(...value);
    }

    const coercedValue = new Type();

    for(let i = 0; i < value.length; i++) {
      coercedValue.push(itemsCoercion(value[i]));
    }

    return coercedValue;
  };
}

function coercionFor(Type, ItemsType) {
  if(ItemsType) {
    return arrayCoercionFor(Type, ItemsType.type);
  }

  const coercion = types.find((c) => c.type === Type);

  if(!coercion) {
    return genericCoercionFor(Type);
  }

  return function coerce(value) {
    if(value === undefined) {
      return;
    }

    if(coercion.test && coercion.test(value)) {
      return value;
    }

    return coercion.coerce(value);
  };
}

exports.coercionFor = coercionFor;
