const { isFunction } = require('lodash');

module.exports = function initializationOrderForSchema(schema) {
  const staticInitializations = [];
  const derivedInitializations = [];

  schema.attributesDefinitions.forEach((attrDefinition) => {
    if (isStaticInitialization(attrDefinition)) {
      staticInitializations.push([attrDefinition.name, staticInitialization]);
    } else {
      derivedInitializations.push([attrDefinition.name, derivedInitialization]);
    }
  });

  return [...staticInitializations, ...derivedInitializations];
};

const isStaticInitialization = (attrDefinition) => !isFunction(attrDefinition.default);

const staticInitialization = (attrDefinition) => attrDefinition.default;

const derivedInitialization = (attrDefinition, instance) => attrDefinition.default(instance);
