const { sortMessagesByExpected } = require('../lib/sorting');
const { isValidPath } = require('../lib/attributePath');
const { failNoNegative, failWrongValidity } = require('../lib/errors');
const matcherName = 'toHaveInvalidAttribute';
const exampleName = 'structure';
const attributePathHint = 'attributePath';
const errorMessagesHint = 'errorMessages';

module.exports = function toHaveInvalidAttribute(structure, attributePath, expectedErrorMessages) {
  if (this.isNot) {
    return failNoNegative(matcherName);
  }

  if (!isValidPath(attributePath)) {
    return {
      pass: false,
      message: () => {
        const hint = this.utils.matcherHint(matcherName, exampleName, attributePathHint, {
          secondArgument: `[${errorMessagesHint}]`,
        });

        return (
          `${matcherName} must not be called without the attribute path\n` + `Example: ${hint}`
        );
      },
    };
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

  if (!expectedErrorMessages || !attributeErrors.length) {
    return {
      pass: Boolean(attributeErrors.length),
      message: () => {
        const hint = this.utils.matcherHint(matcherName, exampleName, attributePathHint, {
          secondArgument: expectedErrorMessages ? errorMessagesHint : '',
        });

        return (
          `${hint}\n\n` +
          `Expected: ${joinedAttributeName} to be ${this.utils.EXPECTED_COLOR('invalid')}\n` +
          `Received: ${joinedAttributeName} is ${this.utils.RECEIVED_COLOR('valid')}`
        );
      },
    };
  }

  const validationErrorMessages = attributeErrors.map((error) => error.message);
  const errorMessages = sortMessagesByExpected(validationErrorMessages, expectedErrorMessages);

  return {
    pass: this.equals(errorMessages, expectedErrorMessages),
    message: () => {
      const hint = this.utils.matcherHint(matcherName, exampleName, attributePathHint, {
        secondArgument: errorMessagesHint,
      });

      return (
        `${hint}\n\n` +
        this.utils.printDiffOrStringify(
          expectedErrorMessages,
          errorMessages,
          `Expected ${joinedAttributeName} error messages`,
          `Received ${joinedAttributeName} error messages`,
          this.expand
        )
      );
    },
  };
};
