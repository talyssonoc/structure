const { expect } = require('chai');
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

    context('when raw value is an instance of class', () => {
      let location, user;

      beforeEach(() => {
        location = new Location({ x: 1, y: 2 });
        user = new User({ location });
      });

      it('does not coerce', () => {
        expect(user.location).to.equal(location);
      });
    });

    context('when attributes is already in correct type', () => {
      let user;

      beforeEach(() => {
        user = new User({
          location: { x: 1, y: 2 },
        });
      });

      it('does not coerce', () => {
        expect(user.location).to.be.instanceOf(Location);
        expect(user.location.x).to.equal(1);
        expect(user.location.y).to.equal(2);
      });
    });

    context('when attributes in a different type', () => {
      let user;

      beforeEach(() => {
        user = new User({
          location: { x: '1', y: '2' },
        });
      });

      it('coerces to correct type', () => {
        expect(user.location).to.be.instanceOf(Location);
        expect(user.location.x).to.equal(1);
        expect(user.location.y).to.equal(2);
      });
    });

    context('when value is undefined', () => {
      let user;

      beforeEach(() => (user = new User({ location: undefined })));

      it('does not coerce', () => {
        expect(user.location).to.be.undefined;
      });
    });

    context('when value is null', () => {
      let user;

      context('and attribute is nullable', () => {
        beforeEach(() => (user = new User({ destination: null })));

        it('assigns null', () => {
          expect(user.destination).to.be.null;
        });
      });

      context('and attribute is not nullable', () => {
        beforeEach(() => (user = new User({ location: null })));

        it('assigns undefined', () => {
          expect(user.location).to.be.undefined;
        });
      });
    });
  });

  describe('Structure class with dynamic attribute types', () => {
    let CircularUser;
    let CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    context('when there are not allowed nullable attributes', () => {
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
        expect(userOne).to.be.instanceOf(CircularUser);
        expect(userOne.favoriteBook).to.be.instanceOf(CircularBook);
        expect(userOne.favoriteBook.owner).to.be.instanceOf(CircularUser);
        expect(userOne.nextBook).to.be.undefined;

        expect(userTwo).to.be.instanceOf(CircularUser);
        expect(userTwo.friends[0]).to.be.instanceOf(CircularUser);
        expect(userTwo.nextBook).to.be.undefined;
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

        expect(user.favoriteBook).to.be.instanceOf(CircularBook);
        expect(user.favoriteBook.name).to.equal('The World of Ice & Fire');
        expect(user.favoriteBook.owner).to.be.instanceOf(CircularUser);
        expect(user.favoriteBook.owner.name).to.equal('New name');
      });
    });

    context('when there are allowed nullable attributes', () => {
      let userOne, userTwo;

      beforeEach(() => {
        userOne = new CircularUser({ friends: [], favoriteBook: null });
        userTwo = new CircularUser({ friends: [userOne], favoriteBook: null });
      });

      it('creates instance properly', () => {
        expect(userOne).to.be.instanceOf(CircularUser);
        expect(userOne.favoriteBook).to.be.null;

        expect(userTwo).to.be.instanceOf(CircularUser);
        expect(userTwo.favoriteBook).to.be.null;
      });
    });
  });
});
