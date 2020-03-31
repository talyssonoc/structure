const { failWrongValidity } = require('../lib/errors');

module.exports = function createValidityAssertion({ pass, passName, failName }) {
  return function(structure, expected) {
    this.utils.ensureNoExpected(expected);

    const { valid } = structure.validate();

    return failWrongValidity({
      pass: pass(valid),
      passName,
      failName,
      context: this,
    });
  };
};
