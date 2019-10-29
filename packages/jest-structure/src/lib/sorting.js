exports.sortMessagesByExpected = function sortMessagesByExpected(
  errorMessages,
  expectedErrorMessages
) {
  expectedErrorMessages = expectedErrorMessages.sample || expectedErrorMessages;

  const equalMessages = expectedErrorMessages.filter((message) => errorMessages.includes(message));
  const differentMessages = errorMessages.filter(
    (message) => !expectedErrorMessages.includes(message)
  );

  return [...equalMessages, ...differentMessages];
};
