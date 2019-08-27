const Errors = require('../errors');
const getType = require('../typeResolver');

module.exports = function arrayCoercionFor(typeDescriptor, itemTypeDescriptor) {
  return function coerceArray(rawValue) {
    if (rawValue === undefined) {
      return;
    }

    validateIfIterable(rawValue);

    const items = extractItems(rawValue);

    const instance = createInstance(typeDescriptor);

    return fillInstance(instance, items, itemTypeDescriptor);
  };
};

function validateIfIterable(value) {
  if (!isIterable(value)) {
    throw Errors.arrayOrIterable();
  }
}

function isIterable(value) {
  return value != null && (value.length != null || value[Symbol.iterator]);
}

function extractItems(iterable) {
  if (!Array.isArray(iterable) && iterable[Symbol.iterator]) {
    return Array(...iterable);
  }

  return iterable;
}

function createInstance(typeDescriptor) {
  const type = getType(typeDescriptor);
  return new type();
}

function fillInstance(instance, items, itemTypeDescriptor) {
  for (let i = 0; i < items.length; i++) {
    instance.push(coerceItem(itemTypeDescriptor, items[i]));
  }

  return instance;
}

function coerceItem(itemTypeDescriptor, item) {
  return itemTypeDescriptor.coerce(item);
}
