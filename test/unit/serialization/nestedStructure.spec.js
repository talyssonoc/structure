const { attributes } = require('../../../src');

describe('serialization', () => {
  describe('Nested structure', () => {
    let Location;
    let User;

    beforeEach(() => {
      Location = attributes({
        longitude: Number,
        latitude: Number,
      })(class Location {});

      User = attributes({
        name: String,
        location: Location,
      })(class User {});
    });

    describe('when all data is present', () => {
      it('include all data defined on schema', () => {
        const location = new Location({
          longitude: 123,
          latitude: 321,
        });

        const user = new User({
          name: 'Something',
          location,
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
          location: {
            longitude: 123,
            latitude: 321,
          },
        });
      });
    });

    describe('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new User({
          name: 'Some name',
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).toEqual({
          name: 'Some name',
        });
      });
    });

    describe('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const location = new Location({
          longitude: 123,
        });

        const user = new User({
          name: 'Name',
          location,
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).toEqual({
          name: 'Name',
          location: {
            longitude: 123,
          },
        });
      });
    });
  });

  describe.skip('Nested structure with dynamic attribute types', () => {
    let CircularUser;
    let CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    describe('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new CircularUser({
          name: 'Something',
          friends: [
            new CircularUser({
              name: 'Friend 1',
              favoriteBook: new CircularBook({ name: 'Book 1' }),
            }),
            new CircularUser({
              name: 'Friend 2',
              favoriteBook: new CircularBook({ name: 'Book 2' }),
            }),
          ],
          favoriteBook: new CircularBook({ name: 'The Book' }),
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
          friends: [
            {
              name: 'Friend 1',
              favoriteBook: { name: 'Book 1' },
            },
            {
              name: 'Friend 2',
              favoriteBook: { name: 'Book 2' },
            },
          ],
          favoriteBook: { name: 'The Book' },
        });
      });
    });

    describe('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new CircularUser({
          name: 'Something',
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
        });
      });
    });

    describe('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const user = new CircularUser({
          name: 'Something',
          favoriteBook: new CircularBook({}),
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
          favoriteBook: {},
        });
      });
    });
  });
});
