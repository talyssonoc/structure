const { expect } = require('chai');
const { nestedArray } = require('./validationHelper');

exports.assertValid = function assertValid(structure) {
  const { valid, errors } = structure.validate();

  expect(valid).to.be.true;
  expect(errors).to.be.undefined;
};

exports.assertInvalid = function assertInvalid(structure, path) {
  const { valid, errors } = structure.validate();

  expect(valid).to.be.false;
  expect(errors).to.be.instanceOf(Array);
  expect(errors).to.have.lengthOf(1);
  expect(errors[0].path).to.eql(nestedArray(path));
};
