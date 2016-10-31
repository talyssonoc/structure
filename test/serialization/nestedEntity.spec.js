const { expect } = require('chai');
const { attributes } = require('../../src');
const { serialize } = require('../../src/serialization');

describe('serialization', () => {
  describe('Nested entity', () => {
    const Location = attributes({
      longitude: Number,
      latitude: Number
    })(class Location {});

    const User = attributes({
      name: String,
      location: Location
    })(class User {});

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const location = new Location({
          longitude: 123,
          latitude: 321
        });

        const user = new User({
          name: 'Something',
          location
        });

        expect(serialize(user)).to.eql({
          name: 'Something',
          location: {
            longitude: 123,
            latitude: 321
          }
        });
      });
    });

    context('when nested entity is missing', () => {
      it('does not set a key for missing entity', () => {
        const user = new User({
          name: 'Some name'
        });

        const serializedUser = serialize(user);

        expect(serializedUser).to.eql({
          name: 'Some name',
        });

        expect(serializedUser).to.have.all.keys(['name']);
      });
    });

    context('when some attribute on nested entity is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const location = new Location({
          longitude: 123
        });

        const user = new User({
          name: 'Name',
          location
        });

        const serializedUser = serialize(user);

        expect(serializedUser).to.eql({
          name: 'Name',
          location: {
            longitude: 123
          }
        });

        expect(serializedUser.location).to.have.all.keys(['longitude']);
      });
    });
  });
});
