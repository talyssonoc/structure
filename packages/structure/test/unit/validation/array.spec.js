const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Array', () => {
    describe('no validation', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: [],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined,
          });

          expect(user).toBeValidStructure();
        });
      });
    });

    describe('required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            required: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: [],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: undefined,
          });

          expect(user).toHaveInvalidAttribute(['books'], ['"books" is required']);
        });
      });
    });

    describe('not required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            required: false,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User();

          expect(user).toBeValidStructure();
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined,
          });

          expect(user).toBeValidStructure();
        });
      });
    });

    describe('sparse array', () => {
      describe('when array can not be sparse', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            books: {
              type: Array,
              itemType: String,
              sparse: false,
            },
          })(class User {});
        });

        describe('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda'],
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when some item is undefined', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              books: ['The Lusiads', undefined],
            });

            expect(user).toHaveInvalidAttribute(
              ['books', 1],
              ['"books[1]" must not be a sparse array item']
            );
          });
        });
      });

      describe('when array can be sparse', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            books: {
              type: Array,
              itemType: String,
              sparse: true,
            },
          })(class User {});
        });

        describe('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda'],
            });

            expect(user).toBeValidStructure();
          });
        });

        describe('when some item is undefined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['The Lusiads', undefined],
            });

            expect(user).toBeValidStructure();
          });
        });
      });
    });

    describe('nested validation', () => {
      let Book;
      let User;

      beforeEach(() => {
        Book = attributes({
          name: {
            type: String,
            required: true,
          },
        })(class Book {});

        User = attributes({
          books: {
            type: Array,
            itemType: Book,
            required: true,
          },
        })(class User {});
      });

      describe('when nested value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              new Book({ name: 'The Silmarillion' }),
              new Book({ name: 'The Lord of the Rings' }),
            ],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [new Book({ name: 'The Hobbit' }), new Book({ name: undefined })],
          });

          expect(user).toHaveInvalidAttribute(
            ['books', 1, 'name'],
            ['"books[1].name" is required']
          );
        });
      });
    });

    describe('nested validation with dynamic attribute types', () => {
      let CircularUser;

      beforeEach(() => {
        CircularUser = require('../../fixtures/CircularUser').User;
      });

      describe('when nested value is present', () => {
        it('is valid', () => {
          const user = new CircularUser({
            friends: [
              new CircularUser({
                favoriteBook: {},
              }),
            ],
            favoriteBook: {},
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new CircularUser({
            friends: [
              new CircularUser({
                favoriteBook: {},
              }),
              new CircularUser(),
            ],
            favoriteBook: {},
          });

          expect(user).toHaveInvalidAttribute(
            ['friends', 1, 'favoriteBook'],
            ['"friends[1].favoriteBook" is required']
          );
        });
      });
    });

    describe('minLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            minLength: 2,
          },
        })(class User {});
      });

      describe('when array has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            books: ['The Name of the Wind', "The Wise Man's Fear"],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when array does not have minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['1984'],
          });

          expect(user).toHaveInvalidAttribute(['books'], ['"books" must contain at least 2 items']);
        });
      });
    });

    describe('maxLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            maxLength: 2,
          },
        })(class User {});
      });

      describe('when array has less than maximum length', () => {
        it('is valid', () => {
          const user = new User({
            books: ['The Name of the Wind'],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when array has more than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['1984', 'The Game of Thrones', 'Dragons of Ether'],
          });

          expect(user).toHaveInvalidAttribute(
            ['books'],
            ['"books" must contain less than or equal to 2 items']
          );
        });
      });
    });

    describe('exactLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            exactLength: 2,
          },
        })(class User {});
      });

      describe('when array has exactly the expected length', () => {
        it('is valid', () => {
          const user = new User({
            books: ['The Gunslinger', 'The Drawing of the Three'],
          });

          expect(user).toBeValidStructure();
        });
      });

      describe('when array has less than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['The Wastelands'],
          });

          expect(user).toHaveInvalidAttribute(['books'], ['"books" must contain 2 items']);
        });
      });

      describe('when array has more than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['Wizard and Glass', 'The Wind Through the Keyhole', 'Wolves of the Calla'],
          });

          expect(user).toHaveInvalidAttribute(['books'], ['"books" must contain 2 items']);
        });
      });
    });
    describe('unique', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          books: {
            type: Array,
            itemType: String,
            unique: true,
          },
        })(class User {});
      });
      describe('when array is unique', () => {
        it('is valid', () => {
          const user = new User({
            books: ['The Gunslinger', 'The Drawing of the Three'],
          });

          expect(user).toBeValidStructure();
        });
      });
      describe('when array is not unique', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['The Wastelands', 'The Wastelands'],
          });

          expect(user).toHaveInvalidAttribute(
            ['books', 1],
            ['"books[1]" contains a duplicate value']
          );
        });
      });
    });
  });
});
