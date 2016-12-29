const { expect } = require('chai');
const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Date', () => {
    describe('no validation', () => {
      const User = attributes({
        birth: {
          type: Date
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            birth: new Date()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            birth: undefined
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        birth: {
          type: Date,
          required: true
        }
      })(class User {});

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
      const now = new Date();

      const User = attributes({
        birth: {
          type: Date,
          equal: now
        }
      })(class User {});

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
        const now = new Date();

        const User = attributes({
          birth: {
            type: Date,
            max: now
          }
        })(class User {});

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
        const now = new Date();

        const User = attributes({
          createdAt: {
            type: Date,
            max: { attr: 'updatedAt' }
          },
          updatedAt: {
            type: Date
          }
        })(class User {});

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
      const now = new Date();

      const User = attributes({
        birth: {
          type: Date,
          min: now
        }
      })(class User {});

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
