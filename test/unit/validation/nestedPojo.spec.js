const { expect } = require('chai');
const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Nested with POJO class', () => {
    describe('no validation', () => {
      class Location {}

      const User = attributes({
        lastLocation: {
          type: Location
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: undefined
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      class Location {}

      const User = attributes({
        lastLocation: {
          type: Location,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: undefined
          });

          assertInvalid(user, 'lastLocation');
        });
      });
    });
  });
});
