exports.assertInvalid = function assertInvalid(structure, path) {
  const { valid, errors } = structure.validate();

  expect(valid).toBe(false);
  expect(errors).toBeInstanceOf(Array);
  expect(errors).toHaveLength(1);
  expect(errors[0].path).toEqual(path);
};
