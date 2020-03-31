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

    describe('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new User({
          name: 'Something',
          age: 42,
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
          age: 42,
        });
      });
    });

    describe('when some attribute is missing', () => {
      it('does not set a key for missing attribute', () => {
        const user = new User({
          name: 'Some name',
          age: undefined,
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).toEqual({
          name: 'Some name',
        });
      });
    });

    describe("when attribute's value is null", () => {
      let City;

      describe('and is not nullable', () => {
        beforeEach(() => {
          City = attributes({ name: String })(class City {});
        });

        it('serializes with default value', () => {
          const city = new City({
            name: null,
          });

          const serializedCity = city.toJSON();

          expect(serializedCity).toEqual({ name: '' });
        });
      });

      describe('and is nullable', () => {
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

          expect(serializedCity).toEqual({ name: null });
        });
      });

      describe('and is a nullable relationship', () => {
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

          expect(serializedCity.country).toBeNull();
        });
      });
    });
  });
});
