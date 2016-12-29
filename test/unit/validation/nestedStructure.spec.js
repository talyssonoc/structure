const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Nested with structure class', () => {
    describe('no validation', () => {
      const Location = attributes({
        x: {
          type: Number
        },
        y: {
          type: Number
        }
      })(class Location {});

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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const Location = attributes({
        x: {
          type: Number
        },
        y: {
          type: Number
        }
      })(class Location {});

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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('lastLocation');
        });
      });
    });

    describe('nested required', () => {
      const Location = attributes({
        x: {
          type: Number,
          required: true
        },
        y: {
          type: Number,
          required: true
        }
      })(class Location {});

      const User = attributes({
        lastLocation: {
          type: Location,
          required: true
        }
      })(class User {});

      context('when nested value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: 2 })
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: undefined})
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('lastLocation.y');
        });
      });
    });
  });
});
