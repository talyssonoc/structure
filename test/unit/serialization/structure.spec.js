const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('serialization', () => {
  describe('Structure', () => {
    let User;

    beforeEach(() => {
      User = attributes({
        name: String,
        age: Number,
      })(class User {});
    });

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new User({
          name: 'Something',
          age: 42,
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          age: 42,
        });
      });
    });

    context('when some attribute is missing', () => {
      it('does not set a key for missing attribute', () => {
        const user = new User({
          name: 'Some name',
          age: undefined,
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Some name',
        });

        expect(serializedUser).to.have.all.keys(['name']);
      });
    });

    context("when attribute's value is null", () => {
      let City;

      context('and is not nullable', () => {
        beforeEach(() => {
          City = attributes({ name: String })(class City {});
        });

        it('serializes with default value', () => {
          const city = new City({
            name: null,
          });

          const serializedCity = city.toJSON();

          expect(serializedCity).to.have.all.keys(['name']);
          expect(serializedCity).to.eql({ name: '' });
        });
      });

      context('and is nullable', () => {
        beforeEach(() => {
          City = attributes({
            name: {
              type: String,
              nullable: true,
            },
          })(class City {});
        });

        it('serializes null attributes', () => {
          const city = new City({ name: null });

          const serializedCity = city.toJSON();

          expect(serializedCity).to.have.all.keys(['name']);
          expect(serializedCity).to.eql({ name: null });
        });
      });

      context('and is a nullable relationship', () => {
        let Country;
        let City;

        beforeEach(() => {
          Country = attributes({ name: String })(class Country {});

          City = attributes({
            country: {
              type: Country,
              nullable: true,
            },
          })(class City {});
        });

        it('serializes null attributes', () => {
          const city = new City({ country: null });

          const serializedCity = city.toJSON();

          expect(serializedCity.country).to.be.null;
        });
      });
    });
  });
});
