const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('Array', () => {
    var Seat;
    var User;

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

      expect(user.books).to.be.undefined;
    });

    context('when raw value is already an array', () => {
      it('coerces items', () => {
        const user = new User({
          books: ['The Lord of The Rings', 1984, true],
        });

        expect(user.books).to.eql(['The Lord of The Rings', '1984', 'true']);
      });

      it('does not coerce items that are of the expected type', () => {
        const book = new String('A Game of Thrones');

        const user = new User({
          books: [book],
        });

        expect(user.books).to.eql([new String('A Game of Thrones')]);
        expect(user.books[0]).to.equal(book);
      });
    });

    context('when raw value is a string', () => {
      it('uses each character as an item', () => {
        const user = new User({
          books: 'ABC',
        });

        expect(user.books).to.eql(['A', 'B', 'C']);
      });

      it('coerces empty string to empty array', () => {
        const user = new User({
          books: '',
        });

        expect(user.books).to.eql([]);
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

        expect(library.bookIds).to.eql([1, 2, 3]);
      });
    });

    context('when raw value is an array-like', () => {
      it('loops using #length property', () => {
        const user = new User({
          books: { 0: 'Stonehenge', 1: 1984, length: 2 },
        });

        expect(user.books).to.eql(['Stonehenge', '1984']);
      });
    });

    context('when raw value implements Symbol.iterator', () => {
      it('converts to array then uses each index', () => {
        const books = {
          *[Symbol.iterator]() {
            for (let i = 0; i < 3; i++) {
              yield i;
            }
          },
        };

        const user = new User({ books });

        expect(user.books).to.eql(['0', '1', '2']);
      });
    });

    context('when raw value is a not iterable', () => {
      it('throws an error', () => {
        expect(() => {
          new User({
            books: 123,
          });
        }).to.throw(TypeError, /^Value must be iterable or array-like\.$/);
      });
    });

    context('when raw value is a single numeric array', () => {
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

        expect(seat.seats).to.eql([1]);
      });
    });
  });

  describe('Array from dynamic type', () => {
    var CircularUser;
    var BooksCollection;

    beforeEach(() => {
      CircularUser = require('../../fixtures/CircularUser');
      BooksCollection = require('../../fixtures/BooksCollection');
    });

    it('coerces collection', () => {
      const user = new CircularUser({
        books: ['Dragons of Ether', 'The Dark Tower'],
      });

      expect(user.books).to.be.instanceOf(BooksCollection);
    });

    it('coerces items', () => {
      const user = new CircularUser({
        books: ['The Lord of The Rings', 1984, true],
      });

      expect(user.books).to.eql(['The Lord of The Rings', '1984', 'true']);
    });

    it('does not coerce items that are of the expected type', () => {
      const book = new String('A Game of Thrones');

      const user = new CircularUser({
        books: [book],
      });

      expect(user.books).to.eql([new String('A Game of Thrones')]);
      expect(user.books[0]).to.equal(book);
    });
  });
});
