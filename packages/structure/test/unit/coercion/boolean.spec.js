const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Boolean', () => {
    let User;

    beforeEach(() => {
      User = attributes({
        isAdmin: Boolean,
        hasAccepted: {
          type: Boolean,
          nullable: true,
        },
      })(class User {});
    });

    it('does not coerces undefined', () => {
      const user = new User({
        isAdmin: undefined,
      });

      expect(user.isAdmin).toBeUndefined();
    });

    it('does not coerces null when nullable', () => {
      const user = new User({
        hasAccepted: null,
      });

      expect(user.hasAccepted).toBeNull();
    });

    it('coerces string to boolean', () => {
      const user = new User({
        isAdmin: '10',
      });

      expect(user.isAdmin).toBe(true);
    });

    it('coerces empty string to false', () => {
      const user = new User({
        isAdmin: '',
      });

      expect(user.isAdmin).toBe(false);
    });

    it('coerces null to false', () => {
      const user = new User({
        isAdmin: null,
      });

      expect(user.isAdmin).toBe(false);
    });

    it('coerces positive number to true', () => {
      const user = new User({
        isAdmin: 1,
      });

      expect(user.isAdmin).toBe(true);
    });

    it('coerces negative number to true', () => {
      const user = new User({
        isAdmin: -1,
      });

      expect(user.isAdmin).toBe(true);
    });

    it('coerces zero to false', () => {
      const user = new User({
        isAdmin: 0,
      });

      expect(user.isAdmin).toBe(false);
    });

    it('coerces date to true', () => {
      const date = new Date();

      const user = new User({
        isAdmin: date,
      });

      expect(user.isAdmin).toBe(true);
    });

    it('coerces object to true', () => {
      const user = new User({
        isAdmin: {},
      });

      expect(user.isAdmin).toBe(true);
    });
  });
});
