const createValidityAssertion = require('../lib/validityAssertion');

module.exports = createValidityAssertion({
  pass: (valid) => valid,
  passName: 'valid',
  failName: 'invalid',
});
