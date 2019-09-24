const { expect } = require('chai');
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

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const location = new Location({
          longitude: 123,
          latitude: 321,
        });

        const user = new User({
          name: 'Something',
          location,
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          location: {
            longitude: 123,
            latitude: 321,
          },
        });
      });
    });

    context('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new User({
          name: 'Some name',
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Some name',
        });

        expect(serializedUser).to.have.all.keys(['name']);
      });
    });

    context('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const location = new Location({
          longitude: 123,
        });

        const user = new User({
          name: 'Name',
          location,
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Name',
          location: {
            longitude: 123,
          },
        });

        expect(serializedUser.location).to.have.all.keys(['longitude']);
      });
    });
  });

  describe('Nested structure with dynamic attribute types', () => {
    let CircularUser;
    let CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    context('when all data is present', () => {
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

        expect(user.toJSON()).to.eql({
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

    context('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new CircularUser({
          name: 'Something',
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
        });
      });
    });

    context('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const user = new CircularUser({
          name: 'Something',
          favoriteBook: new CircularBook({}),
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          favoriteBook: {},
        });
      });
    });
  });
});
