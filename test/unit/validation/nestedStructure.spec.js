const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Nested with structure class', () => {
    describe('no validation', () => {
      var Location;
      var User;

      beforeEach(() => {
        Location = attributes({
          x: {
            type: Number
          },
          y: {
            type: Number
          }
        })(class Location {});

        User = attributes({
          lastLocation: {
            type: Location
          },
          nextLocation: {
            type: Location,
            nullable: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            lastLocation: new Location()
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            lastLocation: undefined
          });

          assertValid(user);
        });
        it('is valid with null when nullable', () => {
          const user = new User({
            nextLocation: null
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      var Location;
      var User;

      beforeEach(() => {
        Location = attributes({
          x: {
            type: Number
          },
          y: {
            type: Number
          }
        })(class Location {});

        User = attributes({
          lastLocation: {
            type: Location,
            required: true
          }
        })(class User {});
      });

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
      var Location;
      var User;

      beforeEach(() => {
        Location = attributes({
          x: {
            type: Number,
            required: true
          },
          y: {
            type: Number,
            required: true
          },
          z: {
            type: Number,
            nullable: true
          }
        })(class Location {});

        User = attributes({
          lastLocation: {
            type: Location,
            required: true
          }
        })(class User {});
      });

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
        it('is valid with null when nullable', () => {
          const user = new User({
            lastLocation: new Location({ x: 1, y: 2, z: null })
          });

          assertValid(user);
        });
      });
    });
  });

  describe('Nested with structure class with dynamic attribute types', () => {
    var CircularUser;
    var CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    describe('no validation', () => {
      context('when value is present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            friends: [],
            favoriteBook: {}
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            favoriteBook: {}
          });

          assertValid(user);
        });
        it('is valid with null when nullable', () => {
          const user = new CircularUser({
            favoriteBook: {},
            nextBook: null
          });

          assertValid(user, 'favoriteBook');
        });
      });
    });

    describe('required', () => {
      context('when value is present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            favoriteBook: {}
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is invalid', () => {
          const user = new CircularUser();

          assertInvalid(user, 'favoriteBook');
        });
      });
    });

    describe('nested required', () => {
      context('when value is present', () => {
        it('is valid', () => {
          const book = new CircularBook({
            owner: {
              favoriteBook: new CircularBook()
            }
          });

          assertValid(book);
        });
      });

      context('when value is not present', () => {
        it('is invalid', () => {
          const book = new CircularBook({
            owner: new CircularUser()
          });

          assertInvalid(book, 'owner.favoriteBook');
        });
      });
    });
  });
});
