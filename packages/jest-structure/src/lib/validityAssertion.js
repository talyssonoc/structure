module.exports = function createValidityAssertion(name, { pass, passName, failName }) {
  return function(structure, expected) {
    this.utils.ensureNoExpected(expected);

    const { valid } = structure.validate();

    const options = {
      isNot: this.isNot,
    };

    return {
      pass: pass(valid),
      message: () =>
        this.utils.matcherHint(name, 'structure', '', options) +
        '\n\n' +
        `Expected: to be ${this.utils.EXPECTED_COLOR(this.isNot ? failName : passName)}\n` +
        `Received: is ${this.utils.RECEIVED_COLOR(this.isNot ? passName : failName)}`,
    };
  };
};
