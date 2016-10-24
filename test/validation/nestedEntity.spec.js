const { expect } = require('chai');
const { attributes } = require('../../src');

describe.only('validation', () => {
  describe('Nested with entity class', () => {
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

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
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

      context.skip('when nested value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: 2 })
          });

          // console.log((user.isValid(), user.lastLocation.x))
          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: undefined})
          });

          console.log((user.isValid(), user.errors))
          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('lastLocation.y');
        });
      });
    });
  });
});
