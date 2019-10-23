const createValidityAssertion = require('./validityAssertion');

module.exports = createValidityAssertion('toBeValid', {
  pass: (valid) => valid,
  passName: 'valid',
  failName: 'invalid',
});
