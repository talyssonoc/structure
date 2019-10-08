const { attributes } = require('../../../src/v2/src');

describe('type coercion', () => {
  let User;

  beforeEach(() => {
    User = attributes({
      name: String,
    })(class User {});
  });

  it('coerces when assigning value', () => {
    const user = new User();

    user.name = 42;

    expect(user.name).toBe('42');
  });
});
