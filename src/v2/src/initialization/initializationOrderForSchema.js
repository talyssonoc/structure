const { isFunction } = require('lodash');

module.exports = function initializationOrderForSchema(schema) {
  const staticInitializations = [];
  const derivedInitializations = [];

  console.log(schema.attributeDescriptors[0].constructor);
  schema.attributeDescriptors.forEach((attrDescriptor) => {
    if (isStaticInitialization(attrDescriptor)) {
      staticInitializations.push([attrDescriptor.name, staticInitialization]);
    } else {
      derivedInitializations.push([attrDescriptor.name, derivedInitialization]);
    }
  });

  return [...staticInitializations, ...derivedInitializations];
};

const isStaticInitialization = (attrDescriptor) => !isFunction(attrDescriptor.default);

const staticInitialization = (attrDescriptor) => attrDescriptor.default;

const derivedInitialization = (attrDescriptor, instance) => attrDescriptor.default(instance);
