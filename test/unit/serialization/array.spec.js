const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('serialization', () => {
  describe('Array', () => {
    const Book = attributes({
      name: String
    })(class Book {});

    const User = attributes({
      name: String,
      books: {
        type: Array,
        itemType: Book
      }
    })(class User {});

    context('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new User({
          name: 'Something',
          books: [
            new Book({ name: 'The Hobbit' })
          ]
        });

        expect(user.toJSON()).to.eql({
          name: 'Something',
          books: [
            { name: 'The Hobbit' }
          ]
        });
      });
    });

    context('when some item is undefined', () => {
      it('does not set a key for missing attribute', () => {
        const user = new User({
          name: 'Some name',
          books: [
            new Book({ name: 'The Silmarillion' }),
            undefined,
            new Book({ name: 'The Lord of the Rings' })
          ]
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).to.eql({
          name: 'Some name',
          books: [
            { name: 'The Silmarillion' },
            undefined,
            { name: 'The Lord of the Rings' }
          ]
        });

        expect(serializedUser).to.have.all.keys(['name', 'books']);
      });
    });
  });
});
