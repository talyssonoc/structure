const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Number', () => {
    var User;

    beforeEach(() => {
      User = attributes({
        age: Number,
        earnings: {
          type: Number,
          nullable: true,
        }
      })(class User {});
    });

    it('does not coerce if value is already a number', () => {
      const age = new Number(42);

      const user = new User({ age });

      expect(user.age).to.not.equal(42);
      expect(user.age).to.not.equal(new Number(42));
      expect(user.age).to.eql(age);
    });

    it('does not coerces undefined', () => {
      const user = new User({
        age: undefined
      });

      expect(user.age).to.be.undefined;
    });

    it('does not coerces null when nullable', () => {
      const user = new User({
        earnings: null
      });

      expect(user.earnings).to.be.null;
    });

    it('coerces string to number', () => {
      const user = new User({
        age: '10'
      });

      expect(user.age).to.equal(10);
    });

    it('coerces null to zero', () => {
      const user = new User({
        age: null
      });

      expect(user.age).to.equal(0);
    });

    it('coerces true to one', () => {
      const user = new User({
        age: true
      });

      expect(user.age).to.equal(1);
    });

    it('coerces false to zero', () => {
      const user = new User({
        age: false
      });

      expect(user.age).to.equal(0);
    });

    it('coerces date to number', () => {
      const date = new Date();

      const user = new User({
        age: date
      });

      expect(user.age).to.equal(date.valueOf());
    });

    describe('coercing an object to number', () => {
      context('when the object does not implement #valueOf()', () => {
        it('coerces object to NaN', () => {
          const objectWithoutValueOf = { data: 42 };

          const user = new User({
            age: objectWithoutValueOf
          });

          expect(Number.isNaN(user.age)).to.be.true;
        });
      });

      context('when the object implements #valueOf()', () => {
        it('coerces object to value returned by #valueOf()', () => {
          const objectWithValueOf = {
            data: '42',
            valueOf() { return this.data; }
          };

          const user = new User({
            age: objectWithValueOf
          });

          expect(user.age).to.equal(42);
        });
      });
    });
  });
});
