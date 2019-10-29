const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Nested with structure class', () => {
    describe('no validation', () => {
      let Location;
      let User;

      beforeEach(() => {
        Location = attributes({
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        })(class Location {});

        User = attributes({
          lastLocation: {
            type: Location,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location(),
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: undefined,
          });

          expect(user).toBeValid();
        });
      });
    });

    describe('required', () => {
      let Location;
      let User;

      beforeEach(() => {
        Location = attributes({
          x: { type: Number },
          y: { type: Number },
        })(class Location {});
      });

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

          expect(user).toBeValid();
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

            expect(user).toBeValid();
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
        Location = attributes({
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        })(class Location {});

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

          expect(user).toBeValid();
        });
      });
    });

    describe('nested required', () => {
      let Location;
      let User;

      describe('when nested value is present', () => {
        beforeEach(() => {
          Location = attributes({
            x: { type: Number, required: true },
            y: { type: Number, required: true },
          })(class Location {});

          User = attributes({
            lastLocation: { type: Location, required: true },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: 2 }),
          });

          expect(user).toBeValid();
        });
      });

      describe('when nested value is not present', () => {
        beforeEach(() => {
          Location = attributes({
            x: { type: Number, required: true },
            y: { type: Number, required: true },
          })(class Location {});

          User = attributes({
            lastLocation: { type: Location, required: true },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: undefined }),
          });

          assertInvalid(user, ['lastLocation', 'y']);
        });
      });

      describe('when nested value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            Location = attributes({
              x: { type: Number, required: true },
              y: { type: Number, required: true, nullable: true },
            })(class Location {});

            User = attributes({
              lastLocation: { type: Location, required: true },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({
              lastLocation: new Location({ x: 1, y: null }),
            });

            expect(user).toBeValid();
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            Location = attributes({
              x: { type: Number, required: true },
              y: { type: Number, required: true, nullable: false },
            })(class Location {});

            User = attributes({
              lastLocation: { type: Location, required: true },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({
              lastLocation: new Location({ x: 1, y: null }),
            });

            assertInvalid(user, ['lastLocation', 'y']);
          });
        });
      });
    });
  });

  describe('Nested with structure class with dynamic attribute types', () => {
    let CircularUser;
    let CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    describe('no validation', () => {
      describe('when value is present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            friends: [],
            favoriteBook: {},
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            favoriteBook: {},
          });

          expect(user).toBeValid();
        });
      });
    });

    describe('required', () => {
      describe('when value is present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            favoriteBook: {},
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is invalid', () => {
          const user = new CircularUser();

          assertInvalid(user, ['favoriteBook']);
        });
      });
    });

    describe('nested required', () => {
      describe('when value is present', () => {
        it('is valid', () => {
          const book = new CircularBook({
            owner: {
              favoriteBook: new CircularBook(),
            },
          });

          expect(book).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is invalid', () => {
          const book = new CircularBook({
            owner: new CircularUser(),
          });

          assertInvalid(book, ['owner', 'favoriteBook']);
        });
      });
    });
  });
});
