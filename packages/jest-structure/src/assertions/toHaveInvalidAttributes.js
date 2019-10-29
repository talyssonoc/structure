const { sortMessagesByExpected } = require('../lib/sorting');
const { isValidPath } = require('../lib/attributePath');
const { failNoNegative, failWrongValidity } = require('../lib/errors');
const matcherName = 'toHaveInvalidAttributes';
const exampleName = 'structure';
const expectedErrorsHint = '[{ path (required), messages (optional) }]';

module.exports = function toHaveInvalidAttributes(structure, expectedErrors) {
  if (this.isNot) {
    return failNoNegative(matcherName);
  }

  if (!expectedErrors || !expectedErrors.length) {
    return {
      pass: false,
      message: () =>
        `${matcherName} must not be called without the expected errros\n` +
        `Example: ${usageHint(this)}`,
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

  if (!expectedErrors.every(errorHasPath)) {
    return failNoPath(this);
  }

  const errorsForComparison = sortByExpected(errors, expectedErrors, this);

  return {
    pass: this.equals(errorsForComparison, expectedErrors),
    message: () => {
      const hint = this.utils.matcherHint(matcherName, exampleName, expectedErrorsHint);

      return (
        `${hint}\n\n` +
        this.utils.printDiffOrStringify(
          expectedErrors,
          errorsForComparison,
          `Expected errors`,
          `Received errors`,
          this.expand
        )
      );
    },
  };
};

const sortByExpected = (errors, expectedErrors, context) => {
  const groupedErrors = groupByPath(errors, context);

  const equalErrors = expectedErrors
    .filter((error) =>
      groupedErrors.find((groupedError) => context.equals(groupedError.path, error.path))
    )
    .map((expectedError) => {
      const error = groupedErrors.find((error) => context.equals(expectedError.path, error.path));

      if (expectedError.messages) {
        return {
          ...error,
          messages: sortMessagesByExpected(error.messages, expectedError.messages),
        };
      }

      return { path: error.path };
    });

  const differentErrors = groupedErrors.filter(
    (groupedError) => !expectedErrors.find((error) => context.equals(groupedError.path, error.path))
  );

  return [...equalErrors, ...differentErrors];
};

const groupByPath = (errors, context) =>
  errors.reduce((grouped, error) => {
    const group = grouped.find((group) => context.equals(group.path, error.path));

    if (group) {
      group.messages.push(error.message);
      return grouped;
    }

    const newGroup = { path: error.path, messages: [error.message] };

    return [...grouped, newGroup];
  }, []);

const usageHint = (context) =>
  context.utils.matcherHint(matcherName, exampleName, expectedErrorsHint);

const errorHasPath = (error) => isValidPath(error.path);

const failNoPath = (context) => ({
  pass: false,
  message: () =>
    `${matcherName} must not be called without the attribute paths\n` +
    `Example: ${usageHint(context)}`,
});
