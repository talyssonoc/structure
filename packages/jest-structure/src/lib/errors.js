module.exports = {
  failNoNegative: (matcherName) => ({
    pass: true, // it has to be true because it's using .not
    message: () => `${matcherName} must not be used with .not`,
  }),
};
