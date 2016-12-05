const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Boolean', () => {
    describe('no validation', () => {
      const User = attributes({
        isAdmin: {
          type: Boolean
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: undefined
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        isAdmin: {
          type: Boolean,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: undefined
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('isAdmin');
        });
      });
    });

    describe('equal', () => {
      const User = attributes({
        isAdmin: {
          type: Boolean,
          equal: true
        }
      })(class User {});

      context('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: false
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('isAdmin');
        });
      });
    });
  });
});
