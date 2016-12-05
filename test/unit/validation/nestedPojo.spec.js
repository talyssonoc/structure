const { expect } = require('chai');
const { attributes } = require('../../../src');

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

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: undefined
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
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

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: undefined
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('lastLocation');
        });
      });
    });
  });
});
