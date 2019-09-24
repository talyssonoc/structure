exports.assertValid = function assertValid(structure) {
  const { valid, errors } = structure.validate();

  expect(valid).toBe(true);
  expect(errors).toBeUndefined();
};

exports.assertInvalid = function assertInvalid(structure, path) {
  const { valid, errors } = structure.validate();

  expect(valid).toBe(false);
  expect(errors).toBeInstanceOf(Array);
  expect(errors).toHaveLength(1);
  expect(errors[0].path).toBe(path);
};
