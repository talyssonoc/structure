const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Boolean', () => {
    describe('no validation', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean,
          },
          hasAccepted: {
            type: Boolean,
            nullable: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true,
          });

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            isAdmin: undefined,
          });

          assertValid(user);
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            hasAccepted: null,
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      let User;

      describe('when value is present', () => {
        beforeEach(() => {
          User = attributes({
            isAdmin: {
              type: Boolean,
              required: true,
            },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            isAdmin: true,
          });

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            isAdmin: {
              type: Boolean,
              required: true,
            },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: undefined,
          });

          assertInvalid(user, 'isAdmin');
        });
      });

      describe('when value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              isAdmin: {
                type: Boolean,
                required: true,
                nullable: true,
              },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({ isAdmin: null });

            assertValid(user);
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              isAdmin: {
                type: Boolean,
                required: true,
                nullable: false,
              },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({ isAdmin: null });

            assertInvalid(user, 'isAdmin');
          });
        });
      });
    });

    describe('not required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean,
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

    describe('equal', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          isAdmin: {
            type: Boolean,
            equal: true,
          },
        })(class User {});
      });

      describe('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            isAdmin: true,
          });

          assertValid(user);
        });
      });

      describe('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            isAdmin: false,
          });

          assertInvalid(user, 'isAdmin');
        });
      });
    });
  });
});
