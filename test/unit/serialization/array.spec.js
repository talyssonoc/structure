const { attributes } = require('../../../src/v2/src');

describe('serialization', () => {
  describe('Array', () => {
    let Book;
    let User;

    beforeEach(() => {
      Book = attributes({
        name: String,
      })(class Book {});

      User = attributes({
        name: String,
        books: {
          type: Array,
          itemType: Book,
        },
      })(class User {});
    });

    describe('when all data is present', () => {
      it('include all data defined on schema', () => {
        const user = new User({
          name: 'Something',
          books: [new Book({ name: 'The Hobbit' })],
        });

        expect(user.toJSON()).toEqual({
          name: 'Something',
          books: [{ name: 'The Hobbit' }],
        });
      });
    });

    describe('when some item is undefined', () => {
      it('does not set a key for missing attribute', () => {
        const user = new User({
          name: 'Some name',
          books: [
            new Book({ name: 'The Silmarillion' }),
            undefined,
            new Book({ name: 'The Lord of the Rings' }),
          ],
        });

        const serializedUser = user.toJSON();

        expect(serializedUser).toEqual({
          name: 'Some name',
          books: [{ name: 'The Silmarillion' }, undefined, { name: 'The Lord of the Rings' }],
        });
      });
    });
  });
});
