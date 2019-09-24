const { attributes } = require('../../../src');
const { expect } = require('chai');

describe('validation', () => {
  describe('Using structure static method', () => {
    let User;
    let Book;

    before(() => {
      Book = attributes({
        name: {
          type: String,
          required: true,
          nullable: true,
        },
      })(class Book {});

      User = attributes({
        name: {
          type: String,
          required: true,
          nullable: false,
        },
        age: {
          type: Number,
          min: 21,
        },
        favoriteBook: Book,
      })(class User {});
    });

    context('when required attributes are present', () => {
      it('returns valid as true and no errors', () => {
        const { valid, errors } = User.validate({
          name: 'The name',
          age: 25,
        });

        expect(valid).to.be.true;
        expect(errors).to.be.undefined;
      });
    });

    context('when required attributes are absent', () => {
      it('returns valid as false and array of errors', () => {
        const { valid, errors } = User.validate({
          age: 10,
        });

        expect(valid).to.be.false;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.lengthOf(2);
        expect(errors[0].path).to.equal('name');
        expect(errors[1].path).to.equal('age');
      });
    });

    context('when required attributes are null', () => {
      context('and attributes is nullable', () => {
        it('is valid', () => {
          const { valid, errors } = Book.validate({ name: null });

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('and attributes is not nullable', () => {
        it('is not valid and has errors set', () => {
          const { valid, errors } = User.validate({ name: null });

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    context('when there is nested validation', () => {
      context('and required attributes are present', () => {
        it('returns valid as true and no errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: {
              name: 'The Lord of the Rings',
            },
          });

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('and required attributes are absent', () => {
        it('returns valid as false and an array of errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: {},
          });

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('favoriteBook.name');
        });
      });

      context('and nullable attributes receive null value', () => {
        it('returns valid as true and no errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: { name: null },
          });

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('and non nullable attributes receive null value', () => {
        let Test;

        before(() => {
          Test = attributes({ user: User })(class Test {});
        });

        it('returns valid as false and an array of errors', () => {
          const { valid, errors } = Test.validate({
            user: { name: null },
          });

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('user.name');
        });
      });
    });

    context('when passed data is a structure', () => {
      context('when required attributes are present and valid', () => {
        it('returns valid as true and no errors', () => {
          const user = new User({
            name: 'Something',
            age: 21,
          });

          const { valid, errors } = User.validate(user);

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when required attributes are absent or invalid', () => {
        it('returns valid as false and array of errors', () => {
          const user = new User({
            age: 10,
          });

          const { valid, errors } = User.validate(user);

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(2);
          expect(errors[0].path).to.equal('name');
          expect(errors[1].path).to.equal('age');
        });
      });

      context('and nullable attributes receive null value', () => {
        it('returns valid as true and no errors', () => {
          const user = new User({
            name: 'Something',
            age: 21,
            favoriteBook: new Book({ name: null }),
          });

          const { valid, errors } = User.validate(user);

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('and non nullable attributes receive null value', () => {
        let Test;

        before(() => {
          Test = attributes({ user: User })(class Test {});
        });

        it('returns valid as false and an array of errors', () => {
          const test = new Test({
            user: { name: null },
          });

          const { valid, errors } = Test.validate(test);

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('user.name');
        });
      });
    });
  });
});
