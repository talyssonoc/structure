const { expect } = require('chai');
const { attributes } = require('../../src');

describe('type coercion', () => {
  const User = attributes({
    name: String
  })(class User {});

  it('coerces when assigning value', () => {
    const user = new User();

    user.name = 42;

    expect(user.name).to.equal('42');
  });
});
