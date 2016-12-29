const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Array', () => {
    describe('no validation', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books');
        });
      });
    });

    describe('sparse array', () => {
      context('when array can not be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            itemType: String,
            sparse: false
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
          });
        });

        context('when some item is undefined', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.false;
            expect(errors).to.be.instanceOf(Array);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].path).to.equal('books.1');
          });
        });
      });

      context('when array can be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            itemType: String,
            sparse: true
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
          });
        });

        context('when some item is undefined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
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
          itemType: Book,
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books.1.name');
        });
      });
    });

    describe('minLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when array has minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              '1984'
            ]
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books');
        });
      });
    });

    describe('maxLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books');
        });
      });
    });

    describe('exactLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when array has less than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              'The Wastelands'
            ]
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books');
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

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('books');
        });
      });
    });
  });
});
