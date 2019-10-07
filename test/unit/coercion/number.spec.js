const { attributes } = require('../../../src/v2/src');

describe('type coercion', () => {
  describe('Number', () => {
    let User;

    beforeEach(() => {
      User = attributes({
        age: Number,
        earnings: {
          type: Number,
          nullable: true,
        },
      })(class User {});
    });

    it('does not coerce if value is already a number', () => {
      const age = new Number(42);

      const user = new User({ age });

      expect(user.age).not.toBe(42);
      expect(user.age).not.toBe(new Number(42));
      expect(user.age).toBe(age);
    });

    it('does not coerces undefined', () => {
      const user = new User({
        age: undefined,
      });

      expect(user.age).toBeUndefined();
    });

    it('does not coerce null when nullable', () => {
      const user = new User({
        earnings: null,
      });

      expect(user.earnings).toBeNull();
    });

    it('coerces string to number', () => {
      const user = new User({
        age: '10',
      });

      expect(user.age).toBe(10);
    });

    it('coerces null to zero', () => {
      const user = new User({
        age: null,
      });

      expect(user.age).toBe(0);
    });

    it('coerces true to one', () => {
      const user = new User({
        age: true,
      });

      expect(user.age).toBe(1);
    });

    it('coerces false to zero', () => {
      const user = new User({
        age: false,
      });

      expect(user.age).toBe(0);
    });

    it('coerces date to number', () => {
      const date = new Date();

      const user = new User({
        age: date,
      });

      expect(user.age).toBe(date.valueOf());
    });

    describe('coercing an object to number', () => {
      describe('when the object does not implement #valueOf()', () => {
        it('coerces object to NaN', () => {
          const objectWithoutValueOf = { data: 42 };

          const user = new User({
            age: objectWithoutValueOf,
          });

          expect(Number.isNaN(user.age)).toBe(true);
        });
      });

      describe('when the object implements #valueOf()', () => {
        it('coerces object to value returned by #valueOf()', () => {
          const objectWithValueOf = {
            data: '42',
            valueOf() {
              return this.data;
            },
          };

          const user = new User({
            age: objectWithValueOf,
          });

          expect(user.age).toBe(42);
        });
      });
    });
  });
});
