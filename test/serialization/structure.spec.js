const { expect } = require('chai');
const { attributes } = require('../../src');
const { serialize } = require('../../src/serialization');

describe('serialization', () => {
  describe('Structure', () => {
    const User = attributes({
      name: String,
      age: Number
    })(class User {});

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new User({
          name: 'Something',
          age: 42
        });

        expect(serialize(user)).to.eql({
          name: 'Something',
          age: 42
        });
      });
    });

    context('when some attribute is missing', () => {
      it('does not set a key for missing attribute', () => {
        const user = new User({
          name: 'Some name',
          age: undefined
        });

        const serializedUser = serialize(user);

        expect(serializedUser).to.eql({
          name: 'Some name',
        });

        expect(serializedUser).to.have.all.keys(['name']);
      });
    });
  });
});
