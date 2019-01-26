const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Boolean', () => {
    describe('no validation', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean
          },
          hasAccepted: {
            type: Boolean,
            nullable: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            isAdmin: undefined
          });

          assertValid(user);
        });
        it('is valid with null when nullable', () => {
          const user = new User({
            hasAccepted: null
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean,
            required: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: undefined
          });

          assertInvalid(user, 'isAdmin');
        });
      });
    });

    describe('equal', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean,
            equal: true
          }
        })(class User {});
      });

      context('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          assertValid(user);
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: false
          });

          assertInvalid(user, 'isAdmin');
        });
      });
    });
  });
});
