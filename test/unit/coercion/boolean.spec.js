const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Boolean', () => {
    var User;

    beforeEach(() => {
      User = attributes({
        isAdmin: Boolean,
        hasAccepted: {
          type: Boolean,
          nullable: true
        }
      })(class User {});
    });

    it('does not coerces undefined', () => {
      const user = new User({
        isAdmin: undefined
      });

      expect(user.isAdmin).to.be.undefined;
    });

    it('does not coerces null when nullable', () => {
      const user = new User({
        hasAccepted: null
      });

      expect(user.hasAccepted).to.be.null;
    });

    it('coerces string to boolean', () => {
      const user = new User({
        isAdmin: '10'
      });

      expect(user.isAdmin).to.equal(true);
    });

    it('coerces empty string to false', () => {
      const user = new User({
        isAdmin: ''
      });

      expect(user.isAdmin).to.equal(false);
    });

    it('coerces null to zero', () => {
      const user = new User({
        isAdmin: null
      });

      expect(user.isAdmin).to.be.false;
    });

    it('coerces positive number to true', () => {
      const user = new User({
        isAdmin: 1
      });

      expect(user.isAdmin).to.be.true;
    });

    it('coerces negative number to true', () => {
      const user = new User({
        isAdmin: -1
      });

      expect(user.isAdmin).to.be.true;
    });

    it('coerces zero to false', () => {
      const user = new User({
        isAdmin: 0
      });

      expect(user.isAdmin).to.be.false;
    });

    it('coerces date to true', () => {
      const date = new Date();

      const user = new User({
        isAdmin: date
      });

      expect(user.isAdmin).to.be.true;
    });

    it('coerces object to true', () => {
      const user = new User({
        isAdmin: {}
      });

      expect(user.isAdmin).to.be.true;
    });
  });
});
