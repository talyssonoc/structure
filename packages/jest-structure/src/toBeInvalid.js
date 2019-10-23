const createValidityAssertion = require('./validityAssertion');

module.exports = createValidityAssertion('toBeInValid', {
  pass: (valid) => !valid,
  passName: 'invalid',
  failName: 'valid',
});
