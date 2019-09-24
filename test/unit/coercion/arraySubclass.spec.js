const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Array subclass', () => {
    let Collection;
    let User;

    beforeEach(() => {
      Collection = class Collection extends Array {};

      User = attributes({
        books: {
          type: Collection,
          itemType: String,
        },
      })(class User {});
    });

    it('does not coerces undefined', () => {
      const user = new User({
        books: undefined,
      });

      expect(user.books).toBeUndefined();
    });

    describe('when raw value is already an array', () => {
      it('coerces items', () => {
        const user = new User({
          books: ['The Lord of The Rings', 1984, true],
        });

        expect(user.books).toEqual(['The Lord of The Rings', '1984', 'true']);
      });

      it('coerces value to instance of array subclass', () => {
        const user = new User({
          books: ['The Lord of The Rings', 1984, true],
        });

        expect(user.books).toBeInstanceOf(Collection);
      });

      it('does not coerce items that are of the expected type', () => {
        const book = new String('A Game of Thrones');

        const user = new User({
          books: [book],
        });

        expect(user.books).toEqual([new String('A Game of Thrones')]);
        expect(user.books[0]).toBe(book);
      });
    });

    describe('when raw value is a string', () => {
      it('uses each character as an item', () => {
        const user = new User({
          books: 'ABC',
        });

        expect(user.books).toEqual(['A', 'B', 'C']);
      });

      it('coerces empty string to empty array', () => {
        const user = new User({
          books: '',
        });

        expect(user.books).toEqual([]);
      });

      it('does nested coercing when expected item type is not String', () => {
        const Library = attributes({
          bookIds: {
            type: Array,
            itemType: Number,
          },
        })(class Library {});

        const library = new Library({
          bookIds: '123',
        });

        expect(library.bookIds).toEqual([1, 2, 3]);
      });

      it('coerces value to instance of array subclass', () => {
        const user = new User({
          books: 'ABC',
        });

        expect(user.books).toBeInstanceOf(Collection);
      });
    });

    describe('when raw value is an array-like', () => {
      it('loops using #length property', () => {
        const user = new User({
          books: { 0: 'Stonehenge', 1: 1984, length: 2 },
        });

        expect(user.books).toEqual(['Stonehenge', '1984']);
      });

      it('coerces value to instance of array subclass', () => {
        const user = new User({
          books: { 0: 'Stonehenge', 1: 1984, length: 2 },
        });

        expect(user.books).toBeInstanceOf(Collection);
      });
    });

    describe('when raw value implements Symbol.iterator', () => {
      const books = {
        *[Symbol.iterator]() {
          for (let i = 0; i < 3; i++) {
            yield i;
          }
        },
      };

      it('converts to array then uses each index', () => {
        const user = new User({ books });

        expect(user.books).toEqual(['0', '1', '2']);
      });

      it('coerces value to instance of array subclass', () => {
        const user = new User({ books });

        expect(user.books).toBeInstanceOf(Collection);
      });
    });

    describe('when raw value is a not iterable', () => {
      it('throws an error', () => {
        expect(() => {
          new User({
            books: 123,
          });
        }).toThrowError(/^Value must be iterable or array-like\.$/);
      });
    });
  });
});
