const { groupByPath } = require('./attributePath');

function sortMessagesByExpected(errorMessages, expectedErrorMessages) {
  expectedErrorMessages = expectedErrorMessages.sample || expectedErrorMessages;

  const equalMessages = expectedErrorMessages.filter((message) => errorMessages.includes(message));
  const differentMessages = errorMessages.filter(
    (message) => !expectedErrorMessages.includes(message)
  );

  return [...equalMessages, ...differentMessages];
}

function sortErrorsByExpected(errors, expectedErrors, context) {
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
}

module.exports = { sortErrorsByExpected, sortMessagesByExpected };
