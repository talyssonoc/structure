const createValidityAssertion = require('../lib/validityAssertion');

module.exports = createValidityAssertion('toBeInValid', {
  pass: (valid) => !valid,
  passName: 'invalid',
  failName: 'valid',
});
