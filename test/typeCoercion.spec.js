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
  });
});
