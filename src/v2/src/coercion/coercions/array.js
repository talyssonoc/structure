const Errors = require('../../../../errors');

module.exports = function arrayCoercionFor(attributeDefinition, itemTypeDefinition) {
  return function coerceArray(rawValue) {
    if (rawValue === undefined) {
      return;
    }

    validateIfIterable(rawValue);

    const items = extractItems(rawValue);

    const instance = createInstance(attributeDefinition);

    return fillInstance(instance, items, itemTypeDefinition);
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

function createInstance(typeDefinition) {
  const type = typeDefinition.resolveType();
  return new type();
}

function fillInstance(instance, items, itemTypeDefinition) {
  for (let i = 0; i < items.length; i++) {
    instance.push(coerceItem(itemTypeDefinition, items[i]));
  }

  return instance;
}

function coerceItem(itemTypeDefinition, item) {
  return itemTypeDefinition.coerce(item);
}
