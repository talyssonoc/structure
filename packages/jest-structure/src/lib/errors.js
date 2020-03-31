module.exports = {
  failNoNegative: (matcherName) => ({
    pass: true, // it has to be true because it's using .not
    message: () => `${matcherName} must not be used with .not`,
  }),
  failWrongValidity: ({ pass, passName, failName, context }) => ({
    pass,
    message: () =>
      `Expected: to be ${context.utils.EXPECTED_COLOR(context.isNot ? failName : passName)}\n` +
      `Received: is ${context.utils.RECEIVED_COLOR(context.isNot ? passName : failName)}`,
  }),
  failInvalidUsage: (matcherName, usageHint, message) => ({
    pass: false,
    message: () => `${matcherName} ${message}\n` + `Example: ${usageHint}`,
  }),
};
