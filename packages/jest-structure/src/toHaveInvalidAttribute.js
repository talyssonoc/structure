const checkInvalid = require('./toBeInvalid');
const matcherName = 'toHaveInvalidAttribute';
const exampleName = 'structure';
const attributePathHint = 'attributePath';
const errorMessagesHint = 'errorMessages';

module.exports = function toHaveInvalidAttribute(structure, attributePath, expectedErrorMessages) {
  if (this.isNot) {
    throw new Error(`${matcherName} must not be used with .not`);
  }

  if (!attributePath || !attributePath.length) {
    const hint = this.utils.matcherHint(matcherName, exampleName, attributePathHint, {
      secondArgument: `[${errorMessagesHint}]`,
    });

    throw new Error(
      `${matcherName} must not be called without the attribute path\n` + `Example: ${hint}`
    );
  }

  const invalidityCheck = checkInvalid.call(this, structure);

  if (!invalidityCheck.pass) {
    return invalidityCheck;
  }

  const { errors } = invalidityCheck.meta;

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

  const errorMessages = orderByExpected(attributeErrors, expectedErrorMessages);

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

const orderByExpected = (attributeErrors, expectedErrorMessages) => {
  const errorMessages = attributeErrors.map((error) => error.message);

  expectedErrorMessages = expectedErrorMessages.sample || expectedErrorMessages;

  const equalMessages = expectedErrorMessages.filter((message) => errorMessages.includes(message));
  const differentMessages = errorMessages.filter(
    (message) => !expectedErrorMessages.includes(message)
  );

  return [...equalMessages, ...differentMessages];
};
