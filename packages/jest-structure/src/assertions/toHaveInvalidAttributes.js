const { failNoNegative } = require('../lib/errors');
const matcherName = 'toHaveInvalidAttributes';
const exampleName = 'structure';
const expectedErrorsHint = 'expectedErrors';

module.exports = function toHaveInvalidAttributes(structure, expectedErrors) {
  if (this.isNot) {
    return failNoNegative(matcherName);
  }

  if (!expectedErrors || !expectedErrors.length) {
    return {
      pass: false,
      message: () => {
        const hint = this.utils.matcherHint(matcherName, exampleName, expectedErrorsHint);
        return (
          `${matcherName} must not be called without the expected errros\n` + `Example: ${hint}`
        );
      },
    };
  }

  const { valid, errors } = structure.validate();

  if (valid) {
    return {
      pass: false,
      message: () => {
        const hint = this.utils.matcherHint(matcherName, exampleName, expectedErrorsHint);

        return (
          `${hint}\n\n` +
          `Expected: to be ${this.utils.EXPECTED_COLOR('invalid')}\n` +
          `Received: is ${this.utils.RECEIVED_COLOR('valid')}`
        );
      },
    };
  }
};
