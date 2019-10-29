const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Date', () => {
    describe('no validation', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          birth: {
            type: Date,
          },
          death: {
            type: Date,
            nullable: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            birth: new Date(),
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            birth: undefined,
          });

          expect(user).toBeValid();
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            death: null,
          });

          expect(user).toBeValid();
        });
      });
    });

    describe('required', () => {
      let User;

      describe('when value is present', () => {
        beforeEach(() => {
          User = attributes({
            birth: {
              type: Date,
              required: true,
            },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            birth: new Date(),
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            birth: {
              type: Date,
              required: true,
            },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            birth: undefined,
          });

          assertInvalid(user, ['birth']);
        });
      });

      describe('when value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              birth: {
                type: Date,
                required: true,
                nullable: true,
              },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({ birth: null });

            expect(user).toBeValid();
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              birth: {
                type: Date,
                required: true,
                nullable: false,
              },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({ birth: null });

            assertInvalid(user, ['birth']);
          });
        });
      });
    });

    describe('not required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          birth: {
            type: Date,
            required: false,
          },
        })(class User {});
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User();

          expect(user).toBeValid();
        });
      });
    });

    describe('equal', () => {
      let now;
      let User;

      beforeEach(() => {
        now = new Date();

        User = attributes({
          birth: {
            type: Date,
            equal: now,
          },
        })(class User {});
      });

      describe('when value is equal', () => {
        it('is valid', () => {
          const nowCopy = new Date(now.toISOString());

          const user = new User({
            birth: nowCopy,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is different', () => {
        it('is not valid and has errors set', () => {
          const otherTime = new Date(10);

          const user = new User({
            birth: otherTime,
          });

          assertInvalid(user, ['birth']);
        });
      });
    });

    describe('max', () => {
      describe('when using a value', () => {
        let User;
        let now;

        beforeAll(() => {
          now = new Date();
        });

        beforeEach(() => {
          User = attributes({
            birth: {
              type: Date,
              max: now,
            },
          })(class User {});
        });

        describe('when date is before max', () => {
          it('is valid', () => {
            const before = new Date(10);

            const user = new User({
              birth: before,
            });

            expect(user).toBeValid();
          });
        });

        describe('when date is after max', () => {
          it('is not valid and has errors set', () => {
            const after = new Date();

            const user = new User({
              birth: after,
            });

            assertInvalid(user, ['birth']);
          });
        });
      });

      describe('when using a reference', () => {
        let now;
        let User;

        beforeAll(() => {
          now = new Date();
        });

        beforeEach(() => {
          User = attributes({
            createdAt: {
              type: Date,
              max: { attr: 'updatedAt' },
            },
            updatedAt: {
              type: Date,
            },
          })(class User {});
        });

        describe('when date is before max', () => {
          it('is valid', () => {
            const before = new Date(10);

            const user = new User({
              createdAt: before,
              updatedAt: now,
            });

            expect(user).toBeValid();
          });
        });

        describe('when date is after max', () => {
          it('is not valid and has errors set', () => {
            const after = new Date();

            const user = new User({
              createdAt: after,
              updatedAt: now,
            });

            assertInvalid(user, ['createdAt']);
          });
        });
      });
    });

    describe('min', () => {
      let User;

      beforeEach(() => {
        const now = new Date();

        User = attributes({
          birth: {
            type: Date,
            min: now,
          },
        })(class User {});
      });

      describe('when date is after min', () => {
        it('is valid', () => {
          const after = new Date();

          const user = new User({
            birth: after,
          });

          expect(user).toBeValid();
        });
      });

      describe('when date is before min', () => {
        it('is not valid and has errors set', () => {
          const before = new Date(10);

          const user = new User({
            birth: before,
          });

          assertInvalid(user, ['birth']);
        });
      });
    });
  });
});
