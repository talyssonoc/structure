const { attributes } = require('../../../src');

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

          expect(user).toBeValidStructure();
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: undefined,
          });

          expect(user).toBeValidStructure();
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

          expect(user).toBeValidStructure();
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

          expect(user).toHaveInvalidAttribute(['lastLocation'], ['"lastLocation" is required']);
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

            expect(user).toBeValidStructure();
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

            expect(user).toHaveInvalidAttribute(['lastLocation'], ['"lastLocation" is required']);
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

          expect(user).toBeValidStructure();
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

          expect(user).toBeValidStructure();
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

          expect(user).toHaveInvalidAttribute(
            ['lastLocation', 'y'],
            ['"lastLocation.y" is required']
          );
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

            expect(user).toBeValidStructure();
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

            expect(user).toHaveInvalidAttribute(
              ['lastLocation', 'y'],
              ['"lastLocation.y" is required']
            );
          });
        });
      });
    });
  });

  describe('Nested with structure class with dynamic attribute types', () => {
    describe('when using inferred identifiers', () => {
      let CircularUser;
      let CircularBook;

      beforeEach(() => {
        CircularUser = require('../../fixtures/CircularUser').User;
        CircularBook = require('../../fixtures/CircularBook').Book;
      });

      describe('no validation', () => {
        describe('when value is present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              friends: [],
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });
      });

      describe('required', () => {
        describe('when value is present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is invalid', () => {
            const user = new CircularUser();

            expect(user).toHaveInvalidAttribute(['favoriteBook'], ['"favoriteBook" is required']);
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

            expect(book).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is invalid', () => {
            const book = new CircularBook({
              owner: new CircularUser(),
            });

            expect(book).toHaveInvalidAttribute(
              ['owner', 'favoriteBook'],
              ['"owner.favoriteBook" is required']
            );
          });
        });
      });
    });

    describe('when using custom identifiers', () => {
      let CircularUser;
      let CircularBook;

      beforeEach(() => {
        CircularUser = require('../../fixtures/CircularUserCustomIdentifier').User;
        CircularBook = require('../../fixtures/CircularBookCustomIdentifier').Book;
      });

      describe('no validation', () => {
        describe('when value is present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              friends: [],
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });
      });

      describe('required', () => {
        describe('when value is present', () => {
          it('is valid', () => {
            const user = new CircularUser({
              favoriteBook: {},
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is invalid', () => {
            const user = new CircularUser();

            expect(user).toHaveInvalidAttribute(['favoriteBook'], ['"favoriteBook" is required']);
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

            expect(book).toBeValidStructure();
          });
        });

        describe('when value is not present', () => {
          it('is invalid', () => {
            const book = new CircularBook({
              owner: new CircularUser(),
            });

            expect(book).toHaveInvalidAttribute(
              ['owner', 'favoriteBook'],
              ['"owner.favoriteBook" is required']
            );
          });
        });
      });
    });

    describe('when nesting is deep', () => {
      it('validates properly', () => {
        const Vehicle = attributes({
          year: {
            type: Number,
            required: true,
          },
        })(class Vehicle {});

        const UserPersonalInformation = attributes(
          {
            name: String,
            vehicle: 'Vehicle',
          },
          {
            dynamics: {
              Vehicle: () => Vehicle,
            },
          }
        )(class UserPersonalInformation {});

        const AutoRiskProfile = attributes(
          {
            userPersonalInformation: {
              type: 'UserPersonalInformation',
              required: true,
            },
          },
          {
            dynamics: {
              UserPersonalInformation: () => UserPersonalInformation,
            },
          }
        )(class AutoRiskProfile {});

        expect(() => {
          AutoRiskProfile.buildStrict({
            userPersonalInformation: new UserPersonalInformation({
              name: 'a',
              vehicle: new Vehicle({
                year: 2018,
              }),
            }),
          });
        }).not.toThrow();
      });
    });
  });
});
