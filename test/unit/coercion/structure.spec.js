const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Structure class', () => {
    let Location;
    let User;

    beforeEach(() => {
      Location = attributes({
        x: Number,
        y: Number,
      })(class Location {});

      User = attributes({
        location: Location,
        destination: {
          type: Location,
          nullable: true,
        },
      })(class User {});
    });

    describe('when raw value is an instance of class', () => {
      let location, user;

      beforeEach(() => {
        location = new Location({ x: 1, y: 2 });
        user = new User({ location });
      });

      it('does not coerce', () => {
        expect(user.location).toBe(location);
      });
    });

    describe('when attributes is already in correct type', () => {
      let user;

      beforeEach(() => {
        user = new User({
          location: { x: 1, y: 2 },
        });
      });

      it('does not coerce', () => {
        expect(user.location).toBeInstanceOf(Location);
        expect(user.location.x).toBe(1);
        expect(user.location.y).toBe(2);
      });
    });

    describe('when attributes in a different type', () => {
      let user;

      beforeEach(() => {
        user = new User({
          location: { x: '1', y: '2' },
        });
      });

      it('coerces to correct type', () => {
        expect(user.location).toBeInstanceOf(Location);
        expect(user.location.x).toBe(1);
        expect(user.location.y).toBe(2);
      });
    });

    describe('when value is undefined', () => {
      let user;

      beforeEach(() => (user = new User({ location: undefined })));

      it('does not coerce', () => {
        expect(user.location).toBeUndefined();
      });
    });

    describe('when value is null', () => {
      let user;

      describe('and attribute is nullable', () => {
        beforeEach(() => (user = new User({ destination: null })));

        it('assigns null', () => {
          expect(user.destination).toBeNull();
        });
      });

      describe('and attribute is not nullable', () => {
        beforeEach(() => (user = new User({ location: null })));

        it('assigns undefined', () => {
          expect(user.location).toBeUndefined();
        });
      });
    });
  });

  describe.only('Structure class with dynamic attribute types', () => {
    let CircularUser;
    let CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    describe('when there are not allowed nullable attributes', () => {
      let userOne, userTwo;

      beforeEach(() => {
        userOne = new CircularUser({
          name: 'Circular user one',
          friends: [],
          favoriteBook: {
            name: 'The Silmarillion',
            owner: {},
          },
          nextBook: null,
        });

        userTwo = new CircularUser({
          name: 'Circular user two',
          friends: [userOne],
          nextBook: null,
        });
      });

      it('creates instance properly', () => {
        expect(userOne).toBeInstanceOf(CircularUser);
        expect(userOne.favoriteBook).toBeInstanceOf(CircularBook);
        expect(userOne.favoriteBook.owner).toBeInstanceOf(CircularUser);
        expect(userOne.nextBook).toBeUndefined();

        expect(userTwo).toBeInstanceOf(CircularUser);
        expect(userTwo.friends[0]).toBeInstanceOf(CircularUser);
        expect(userTwo.nextBook).toBeUndefined();
      });

      it('coerces when updating the value', () => {
        const user = new CircularUser({
          favoriteBook: {
            name: 'The Silmarillion',
            owner: {},
          },
        });

        user.favoriteBook = {
          name: 'The World of Ice & Fire',
          owner: { name: 'New name' },
        };

        expect(user.favoriteBook).toBeInstanceOf(CircularBook);
        expect(user.favoriteBook.name).toBe('The World of Ice & Fire');
        expect(user.favoriteBook.owner).toBeInstanceOf(CircularUser);
        expect(user.favoriteBook.owner.name).toBe('New name');
      });
    });

    describe('when there are allowed nullable attributes', () => {
      let userOne, userTwo;

      beforeEach(() => {
        userOne = new CircularUser({ friends: [], favoriteBook: null });
        userTwo = new CircularUser({ friends: [userOne], favoriteBook: null });
      });

      it('creates instance properly', () => {
        expect(userOne).toBeInstanceOf(CircularUser);
        expect(userOne.favoriteBook).toBeNull();

        expect(userTwo).toBeInstanceOf(CircularUser);
        expect(userTwo.favoriteBook).toBeNull();
      });
    });
  });
});
