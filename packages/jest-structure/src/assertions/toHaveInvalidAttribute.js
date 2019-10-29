const { sortMessagesByExpected } = require('../lib/sorting');
const { isValidPath } = require('../lib/attributePath');
const { failNoNegative, failWrongValidity } = require('../lib/errors');
const matcherName = 'toHaveInvalidAttribute';
const exampleName = 'structure';
const attributePathHint = 'attributePath';
const errorMessagesHint = '[errorMessages]';

module.exports = function toHaveInvalidAttribute(structure, attributePath, expectedErrorMessages) {
  if (this.isNot) {
    return failNoNegative(matcherName);
  }

  if (!isValidPath(attributePath)) {
    return failInvalidUsage(this, 'must not be called without the attribute path');
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

  const attributeErrors = errors.filter((error) => this.equals(error.path, attributePath));

  const joinedAttributeName = attributePath.join('.');

  if (isExpectedAttributeValid(expectedErrorMessages, attributeErrors)) {
    return {
      pass: Boolean(attributeErrors.length),
      message: () =>
        `Expected: ${joinedAttributeName} to be ${this.utils.EXPECTED_COLOR('invalid')}\n` +
        `Received: ${joinedAttributeName} is ${this.utils.RECEIVED_COLOR('valid')}`,
    };
  }

  const validationErrorMessages = attributeErrors.map((error) => error.message);
  const errorMessages = sortMessagesByExpected(validationErrorMessages, expectedErrorMessages);

  return {
    pass: this.equals(errorMessages, expectedErrorMessages),
    message: () =>
      this.utils.printDiffOrStringify(
        expectedErrorMessages,
        errorMessages,
        `Expected ${joinedAttributeName} error messages`,
        `Received ${joinedAttributeName} error messages`,
        this.expand
      ),
  };
};

const failInvalidUsage = (context, message) => ({
  pass: false,
  message: () => `${matcherName} ${message}\n` + `Example: ${usageHint(context)}`,
});

const usageHint = (context) =>
  context.utils.matcherHint(matcherName, exampleName, attributePathHint, {
    secondArgument: errorMessagesHint,
  });

const isExpectedAttributeValid = (expectedErrorMessages, attributeErrors) =>
  !(expectedErrorMessages && attributeErrors.length);
