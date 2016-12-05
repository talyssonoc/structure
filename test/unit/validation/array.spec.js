const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Array', () => {
    describe('no validation', () => {
      const User = attributes({
        books: {
          type: Array,
          items: String
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        books: {
          type: Array,
          items: String,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: undefined
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books');
        });
      });
    });

    describe('sparse array', () => {
      context('when array can not be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            items: String,
            sparse: false
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when some item is undefined', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('books.1');
          });
        });
      });

      context('when array can be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            items: String,
            sparse: true
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when some item is undefined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });
      });
    });

    describe('nested validation', () => {
      const Book = attributes({
        name: {
          type: String,
          required: true
        }
      })(class Book {});

      const User = attributes({
        books: {
          type: Array,
          items: Book,
          required: true
        }
      })(class User {});

      context('when nested value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              new Book({ name: 'The Silmarillion' }),
              new Book({ name: 'The Lord of the Rings' })
            ]
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              new Book({ name: 'The Hobbit' }),
              new Book({ name: undefined })
            ]
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books.1.name');
        });
      });
    });

    describe('minLength', () => {
      const User = attributes({
        books: {
          type: Array,
          items: String,
          minLength: 2
        }
      })(class User {});

      context('when array has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Name of the Wind',
              'The Wise Man\'s Fear'
            ]
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when array has minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              '1984'
            ]
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books');
        });
      });
    });

    describe('maxLength', () => {
      const User = attributes({
        books: {
          type: Array,
          items: String,
          maxLength: 2
        }
      })(class User {});

      context('when array has less than maximum length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Name of the Wind'
            ]
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when array has more than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              '1984',
              'The Game of Thrones',
              'Dragons of Ether'
            ]
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books');
        });
      });
    });

    describe('exactLength', () => {
      const User = attributes({
        books: {
          type: Array,
          items: String,
          exactLength: 2
        }
      })(class User {});

      context('when array has exactly the expected length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Gunslinger',
              'The Drawing of the Three'
            ]
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when array has less than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              'The Wastelands'
            ]
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books');
        });
      });

      context('when array has more than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              'Wizard and Glass',
              'The Wind Through the Keyhole',
              'Wolves of the Calla'
            ]
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('books');
        });
      });
    });
  });
});
