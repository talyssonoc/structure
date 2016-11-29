const { expect } = require('chai');
const { attributes } = require('../../src');

describe('type coercion', () => {
  describe('Structure class', () => {
    const Location = attributes({
      x: Number,
      y: Number
    })(class Location {});

    const User = attributes({
      location: Location
    })(class User {});

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
});
