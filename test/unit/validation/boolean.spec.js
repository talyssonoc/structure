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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('isAdmin');
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: false
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('isAdmin');
        });
      });
    });
  });
});
