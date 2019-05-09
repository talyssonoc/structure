const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('serialization', () => {
  describe('Nested structure', () => {
    var Location;
    var User;

    beforeEach(() => {
      Location = attributes({
        longitude: Number,
        latitude: Number
      })(class Location {});

      User = attributes({
        name: String,
        location: Location
      })(class User {});
    });

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

        expect(user.toJSON()).to.eql({
          name: 'Something',
          location: {
            longitude: 123,
            latitude: 321
          }
        });
      });
    });

    context('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new User({
          name: 'Some name'
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Some name',
        });

        expect(serializedUser).to.have.all.keys(['name']);
      });
    });

    context('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const location = new Location({
          longitude: 123
        });

        const user = new User({
          name: 'Name',
          location
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Name',
          location: {
            longitude: 123
          }
        });

        expect(serializedUser.location).to.have.all.keys(['longitude']);
      });
    });

    context('when a nested structure provides a static toJSON', () => {
      var Person;
      var Pet;

      beforeEach(() => {
        Pet = attributes({
          name: String,
          breed: String
        })(class Pet {
          static toJSON(json) {
            json.petTagID = 123;
            return json;
          }
        });

        Person = attributes({
          name: String,
          age: Number,
          pet: Pet
        })(class Person {});
      });

      it('modifies the nested structure when serializing', () => {
        const pet = new Pet({
          name: 'Spot',
          breed: 'dog'
        });

        const person = new Person({
          name: 'Bill',
          age: 42,
          pet
        });

        const serializedPerson = person.toJSON();

        expect(serializedPerson).to.eql({
          name: 'Bill',
          age: 42,
          pet: {
            name: 'Spot',
            breed: 'dog',
            petTagID: 123
          }
        });
      });
    });
  });

  describe('Nested structure with dynamic attribute types', () => {
    var CircularUser;
    var CircularBook;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      CircularBook = require('../../fixtures/CircularBook');
    });

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new CircularUser({
          name: 'Something',
          friends: [
            new CircularUser({
              name: 'Friend 1',
              favoriteBook: new CircularBook({ name: 'Book 1' })
            }),
            new CircularUser({
              name: 'Friend 2',
              favoriteBook: new CircularBook({ name: 'Book 2'})
            })
          ],
          favoriteBook: new CircularBook({ name: 'The Book'})
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          friends: [
            {
              name: 'Friend 1',
              favoriteBook: { name: 'Book 1' }
            },
            {
              name: 'Friend 2',
              favoriteBook: { name: 'Book 2'}
            }
          ],
          favoriteBook: { name: 'The Book' }
        });
      });
    });

    context('when nested structure is missing', () => {
      it('does not set a key for missing structure', () => {
        const user = new CircularUser({
          name: 'Something'
        });

        expect(user.toJSON()).to.eql({
          name: 'Something'
        });
      });
    });

    context('when some attribute on nested structure is missing', () => {
      it('does not set a key for missing nested attribute', () => {
        const user = new CircularUser({
          name: 'Something',
          favoriteBook: new CircularBook({})
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          favoriteBook: {}
        });
      });
    });
  });
});
