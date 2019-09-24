const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Array', () => {
    let Seat;
    let User;

    beforeEach(() => {
      User = attributes({
        books: {
          type: Array,
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
    });

    describe('when raw value is an array-like', () => {
      it('loops using #length property', () => {
        const user = new User({
          books: { 0: 'Stonehenge', 1: 1984, length: 2 },
        });

        expect(user.books).toEqual(['Stonehenge', '1984']);
      });
    });

    describe('when raw value implements Symbol.iterator', () => {
      it('converts to array then uses each index', () => {
        const books = {
          *[Symbol.iterator]() {
            for (let i = 0; i < 3; i++) {
              yield i;
            }
          },
        };

        const user = new User({ books });

        expect(user.books).toEqual(['0', '1', '2']);
      });
    });

    describe('when raw value is a not iterable', () => {
      it('throws an error', () => {
        expect(() => {
          new User({
            books: 123,
          });
        }).toThrow(/^Value must be iterable or array-like\.$/);
      });
    });

    describe('when raw value is a single numeric array', () => {
      beforeEach(() => {
        Seat = attributes({
          seats: {
            type: Array,
            itemType: Number,
          },
        })(class Seat {});
      });

      it('return the correct array', () => {
        const seat = new Seat({
          seats: [1],
        });

        expect(seat.seats).toEqual([1]);
      });
    });
  });

  describe('Array from dynamic type', () => {
    let CircularUser;
    let BooksCollection;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      BooksCollection = require('../../fixtures/BooksCollection');
    });

    it('coerces collection', () => {
      const user = new CircularUser({
        books: ['Dragons of Ether', 'The Dark Tower'],
      });

      expect(user.books).toBeInstanceOf(BooksCollection);
    });

    it('coerces items', () => {
      const user = new CircularUser({
        books: ['The Lord of The Rings', 1984, true],
      });

      expect(user.books).toEqual(['The Lord of The Rings', '1984', 'true']);
    });

    it('does not coerce items that are of the expected type', () => {
      const book = new String('A Game of Thrones');

      const user = new CircularUser({
        books: [book],
      });

      expect(user.books).toEqual([new String('A Game of Thrones')]);
      expect(user.books[0]).toBe(book);
    });
  });
});
