const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

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

          assertValid(user);
        });
      });

      context('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: undefined})
          });

          assertInvalid(user, 'lastLocation.y');
        });
      });
    });
  });
});
