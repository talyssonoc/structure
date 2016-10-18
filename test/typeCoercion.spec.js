const { expect } = require('chai');
const { attributes } = require('../src');

describe('type coercion', () => {
  describe('String', () => {
    const User = attributes({
      name: String
    })(class User {});

    it('does not coerce if value is already a string', () => {
      const name = new String('Some name');

      const user = new User({
        name: name
      });

      expect(user.name).to.not.equal('Some name');
      expect(user.name).to.not.equal(new String('Some name'));
      expect(user.name).to.eql(name);
    });

    it('coerces integer to string', () => {
      const user = new User({
        name: 10
      });

      expect(user.name).to.equal('10');
    });

    it('coerces float to string', () => {
      const user = new User({
        name: 10.42
      });

      expect(user.name).to.equal('10.42');
    });

    it('coerces null to empty string', () => {
      const user = new User({
        name: null
      });

      expect(user.name).to.equal('');
    });

    it('coerces undefined to empty string', () => {
      const user = new User({
        name: undefined
      });

      expect(user.name).to.equal('');
    });

    it('coerces boolean to string', () => {
      const user = new User({
        name: false
      });

      expect(user.name).to.equal('false');
    });

    it('coerces date to string', () => {
      const date = new Date();

      const user = new User({
        name: date
      });

      expect(user.name).to.equal(date.toString());
    });

    describe('coercing an object to string', () => {
      context('when the object does not implement #toString()', () => {
        it('coerces objects to object tag string', () => {
          const objectWithoutToString = { data: 42 };

          const user = new User({
            name: objectWithoutToString
          });

          expect(user.name).to.equal('[object Object]');
        });
      });

      context('when the object implements #toString()', () => {
        it('coerces objects to object tag string', () => {
          const objectWithToString = {
            data: 42,
            toString() { return this.data }
          };

          const user = new User({
            name: objectWithToString
          });

          expect(user.name).to.equal('42');
        });
      });
    });
  });
});
