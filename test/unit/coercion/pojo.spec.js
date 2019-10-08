const { attributes } = require('../../../src/v2/src');

describe('type coercion', () => {
  describe('POJO class', () => {
    let User;
    let Location;

    beforeEach(() => {
      Location = class Location {
        constructor({ x, y }) {
          this.x = x;
          this.y = y;
        }
      };

      User = attributes({
        location: Location,
      })(class User {});
    });

    it('does not coerce if raw value is an instance of class', () => {
      const location = new Location({ x: 1, y: 2 });

      const user = new User({ location });

      expect(user.location).toBe(location);
    });

    it('instantiates class with raw value', () => {
      const user = new User({
        location: { x: 1, y: 2 },
      });

      expect(user.location).toBeInstanceOf(Location);
      expect(user.location.x).toBe(1);
      expect(user.location.y).toBe(2);
    });

    it('does not coerce undefined', () => {
      const user = new User({
        location: undefined,
      });

      expect(user.location).toBeUndefined();
    });
  });
});
