const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Structure class', () => {
    var Location;
    var User;

    beforeEach(() => {
      Location = attributes({
        x: Number,
        y: Number
      })(class Location {});

      User = attributes({
        location: Location,
        destination: {
          type: Location,
          nullable: true
        }
      })(class User {});
    });

    it('does not coerce if raw value is an instance of class', () => {
      const location = new Location({ x: 1, y: 2});

      const user = new User({ location });

      expect(user.location).to.equal(location);
    });

    it('does not coerce undefined', () => {
      const user = new User({
        location: undefined
      });

      expect(user.location).to.be.undefined;
    });

    it('does not coerce null when nullable', () => {
      const user = new User({
        destination: null
      });

      expect(user.destination).to.be.null;
    });

    it('instantiates class with raw value', () => {
      const user = new User({
        location: { x: 1, y: 2}
      });

      expect(user.location).to.be.instanceOf(Location);
      expect(user.location.x).to.equal(1);
      expect(user.location.y).to.equal(2);
    });

    it('does nested coercion', () => {
      const user = new User({
        location: { x: '1', y: '2'}
      });

      expect(user.location).to.be.instanceOf(Location);
      expect(user.location.x).to.equal(1);
      expect(user.location.y).to.equal(2);
    });
  });

  describe('Structure class with dynamic attribute types', () => {
    var CircularUser;
    var CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    it('creates instance properly', () => {
      const userOne = new CircularUser({
        name: 'Circular user one',
        friends: [],
        favoriteBook: {
          name: 'The Silmarillion',
          owner: {}
        }
      });

      const userTwo = new CircularUser({
        name: 'Circular user two',
        friends: [userOne]
      });

      expect(userOne).to.be.instanceOf(CircularUser);
      expect(userOne.favoriteBook).to.be.instanceOf(CircularBook);
      expect(userOne.favoriteBook.owner).to.be.instanceOf(CircularUser);
      expect(userTwo).to.be.instanceOf(CircularUser);
      expect(userTwo.friends[0]).to.be.instanceOf(CircularUser);
    });

    it('coerces when updating the value', () => {
      const user = new CircularUser({
        favoriteBook: {
          name: 'The Silmarillion',
          owner: {}
        }
      });

      user.favoriteBook = {
        name: 'The World of Ice & Fire',
        owner: {
          name: 'New name'
        }
      };

      expect(user.favoriteBook).to.be.instanceOf(CircularBook);
      expect(user.favoriteBook.name).to.equal('The World of Ice & Fire');
      expect(user.favoriteBook.owner).to.be.instanceOf(CircularUser);
      expect(user.favoriteBook.owner.name).to.equal('New name');
    });
  });
});
