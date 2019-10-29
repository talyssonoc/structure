const { sortErrorsByExpected } = require('../lib/sorting');
const { areExpectedErrorsPathsValid } = require('../lib/attributePath');
const { failInvalidUsage, failNoNegative, failWrongValidity } = require('../lib/errors');
const matcherName = 'toHaveInvalidAttributes';
const exampleName = 'structure';
const expectedErrorsHint = '[{ path (required), messages (optional) }]';

module.exports = function toHaveInvalidAttributes(structure, expectedErrors) {
  if (this.isNot) {
    return failNoNegative(matcherName);
  }

  if (!areExpectedErrorsPresent(expectedErrors)) {
    return failInvalidUsage(
      matcherName,
      usageHint(this),
      'must not be called without the expected errros'
    );
  }

  const { valid, errors } = structure.validate();

  if (valid) {
    return failWrongValidity({
      pass: false,
      passName: 'invalid',
      failName: 'valid',
      context: this,
    });
  }

  if (!areExpectedErrorsPathsValid(expectedErrors)) {
    return failNoPath(this);
  }

  const errorsForComparison = sortErrorsByExpected(errors, expectedErrors, this);

  return {
    pass: this.equals(errorsForComparison, expectedErrors),
    message: () =>
      this.utils.printDiffOrStringify(
        expectedErrors,
        errorsForComparison,
        `Expected errors`,
        `Received errors`,
        this.expand
      ),
  };
};

const areExpectedErrorsPresent = (expectedErrors) => expectedErrors && expectedErrors.length;

const usageHint = (context) =>
  context.utils.matcherHint(matcherName, exampleName, expectedErrorsHint);

const failNoPath = (context) => ({
  pass: false,
  message: () =>
    `${matcherName} must not be called without the attribute paths\n` +
    `Example: ${usageHint(context)}`,
});
