const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Nested with POJO class', () => {
    describe('no validation', () => {
      let Location;
      let User;

      beforeEach(() => {
        Location = class Location {};

        User = attributes({
          lastLocation: {
            type: Location,
          },
          nextLocation: {
            type: Location,
            nullable: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location(),
          });

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            lastLocation: undefined,
          });

          assertValid(user);
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            nextLocation: null,
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      let Location;
      let User;

      beforeEach(() => (Location = class Location {}));

      describe('when value is present', () => {
        beforeEach(() => {
          User = attributes({
            lastLocation: {
              type: Location,
              required: true,
            },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            lastLocation: new Location(),
          });

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            lastLocation: {
              type: Location,
              required: true,
            },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: undefined,
          });

          assertInvalid(user, ['lastLocation']);
        });
      });

      describe('when value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              lastLocation: {
                type: Location,
                required: true,
                nullable: true,
              },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({ lastLocation: null });

            assertValid(user);
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              lastLocation: {
                type: Location,
                required: true,
                nullable: false,
              },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({ lastLocation: null });

            assertInvalid(user, ['lastLocation']);
          });
        });
      });
    });

    describe('not required', () => {
      let Location;
      let User;

      beforeEach(() => {
        Location = class Location {};

        User = attributes({
          lastLocation: {
            type: Location,
            required: false,
          },
        })(class User {});
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User();

          assertValid(user);
        });
      });
    });
  });
});
