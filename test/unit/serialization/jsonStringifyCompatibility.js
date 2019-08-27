const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('JSON.stringify compatibility', () => {
  context('when the structure is serialized with JSON.stringify', () => {
    it('calls .toJSON() method', () => {
      const Location = attributes({
        x: Number,
        y: Number,
      })(class Location {});

      const User = attributes({
        name: String,
        location: Location,
      })(class User {});

      const user = new User({
        name: 'Some name',
        location: new Location({
          x: 1,
          y: 2,
        }),
      });

      expect(JSON.parse(JSON.stringify(user))).to.eql(user.toJSON());
    });
  });
});
