const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Date', () => {
    describe('no validation', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          birth: {
            type: Date
          },
          death: {
            type: Date,
            nullable: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            birth: new Date()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            birth: undefined
          });

          assertValid(user);
        });
        it('is valid with null when nullable', () => {
          const user = new User({
            death: null
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          birth: {
            type: Date,
            required: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            birth: new Date()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            birth: undefined
          });

          assertInvalid(user, 'birth');
        });
      });
    });

    describe('equal', () => {
      var now;
      var User;

      beforeEach(() => {
        now = new Date();

        User = attributes({
          birth: {
            type: Date,
            equal: now
          }
        })(class User {});
      });

      context('when value is equal', () => {
        it('is valid', () => {
          const nowCopy = new Date(now.toISOString());

          const user = new User({
            birth: nowCopy
          });

          assertValid(user);
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const otherTime = new Date(10);

          const user = new User({
            birth: otherTime
          });

          assertInvalid(user, 'birth');
        });
      });
    });

    describe('max', () => {
      describe('when using a value', () => {
        var User;
        var now;

        before(() => {
          now = new Date();
        });

        beforeEach(() => {
          User = attributes({
            birth: {
              type: Date,
              max: now
            }
          })(class User {});
        });

        context('when date is before max', () => {
          it('is valid', () => {
            const before = new Date(10);

            const user = new User({
              birth: before
            });

            assertValid(user);
          });
        });

        context('when date is after max', () => {
          it('is not valid and has errors set', () => {
            const after = new Date();

            const user = new User({
              birth: after
            });

            assertInvalid(user, 'birth');
          });
        });
      });

      describe('when using a reference', () => {
        var now;
        var User;

        before(() => {
          now = new Date();
        });

        beforeEach(() => {
          User = attributes({
            createdAt: {
              type: Date,
              max: { attr: 'updatedAt' }
            },
            updatedAt: {
              type: Date
            }
          })(class User {});
        });

        context('when date is before max', () => {
          it('is valid', () => {
            const before = new Date(10);

            const user = new User({
              createdAt: before,
              updatedAt: now
            });

            assertValid(user);
          });
        });

        context('when date is after max', () => {
          it('is not valid and has errors set', () => {
            const after = new Date();

            const user = new User({
              createdAt: after,
              updatedAt: now
            });

            assertInvalid(user, 'createdAt');
          });
        });
      });
    });

    describe('min', () => {
      var User;

      beforeEach(() => {
        const now = new Date();

        User = attributes({
          birth: {
            type: Date,
            min: now
          }
        })(class User {});
      });

      context('when date is after min', () => {
        it('is valid', () => {
          const after = new Date();

          const user = new User({
            birth: after
          });

          assertValid(user);
        });
      });

      context('when date is before min', () => {
        it('is not valid and has errors set', () => {
          const before = new Date(10);

          const user = new User({
            birth: before
          });

          assertInvalid(user, 'birth');
        });
      });
    });
  });
});
