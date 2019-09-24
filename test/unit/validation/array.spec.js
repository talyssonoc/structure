const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

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

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined,
          });

          assertValid(user);
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

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: undefined,
          });

          assertInvalid(user, 'books');
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

          assertValid(user);
        });
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined,
          });

          assertValid(user, 'books');
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

            assertValid(user);
          });
        });

        describe('when some item is undefined', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              books: ['The Lusiads', undefined],
            });

            assertInvalid(user, 'books.1');
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

            assertValid(user);
          });
        });

        describe('when some item is undefined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['The Lusiads', undefined],
            });

            assertValid(user);
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

          assertValid(user);
        });
      });

      describe('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [new Book({ name: 'The Hobbit' }), new Book({ name: undefined })],
          });

          assertInvalid(user, 'books.1.name');
        });
      });
    });

    describe('nested validation with dynamic attribute types', () => {
      let CircularUser;

      beforeEach(() => {
        CircularUser = require('../../fixtures/CircularUser');
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

          assertValid(user);
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

          assertInvalid(user, 'friends.1.favoriteBook');
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

          assertValid(user);
        });
      });

      describe('when array does not have minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['1984'],
          });

          assertInvalid(user, 'books');
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

          assertValid(user);
        });
      });

      describe('when array has more than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['1984', 'The Game of Thrones', 'Dragons of Ether'],
          });

          assertInvalid(user, 'books');
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

          assertValid(user);
        });
      });

      describe('when array has less than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['The Wastelands'],
          });

          assertInvalid(user, 'books');
        });
      });

      describe('when array has more than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['Wizard and Glass', 'The Wind Through the Keyhole', 'Wolves of the Calla'],
          });

          assertInvalid(user, 'books');
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

          assertValid(user);
        });
      });
      describe('when array is not unique', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: ['The Wastelands', 'The Wastelands'],
          });

          assertInvalid(user, 'books.1');
        });
      });
    });
  });
});
