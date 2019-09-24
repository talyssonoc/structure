const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Using structure static method', () => {
    let User;
    let Book;

    beforeAll(() => {
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

    describe('when required attributes are present', () => {
      it('returns valid as true and no errors', () => {
        const { valid, errors } = User.validate({
          name: 'The name',
          age: 25,
        });

        expect(valid).toBe(true);
        expect(errors).toBeUndefined();
      });
    });

    describe('when required attributes are absent', () => {
      it('returns valid as false and array of errors', () => {
        const { valid, errors } = User.validate({
          age: 10,
        });

        expect(valid).toBe(false);
        expect(errors).toBeInstanceOf(Array);
        expect(errors).toHaveLength(2);
        expect(errors[0].path).toBe('name');
        expect(errors[1].path).toBe('age');
      });
    });

    describe('when required attributes are null', () => {
      describe('and attributes is nullable', () => {
        it('is valid', () => {
          const { valid, errors } = Book.validate({ name: null });

          expect(valid).toBe(true);
          expect(errors).toBeUndefined();
        });
      });

      describe('and attributes is not nullable', () => {
        it('is not valid and has errors set', () => {
          const { valid, errors } = User.validate({ name: null });

          expect(valid).toBe(false);
          expect(errors).toBeInstanceOf(Array);
          expect(errors).toHaveLength(1);
          expect(errors[0].path).toBe('name');
        });
      });
    });

    describe('when there is nested validation', () => {
      describe('and required attributes are present', () => {
        it('returns valid as true and no errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: {
              name: 'The Lord of the Rings',
            },
          });

          expect(valid).toBe(true);
          expect(errors).toBeUndefined();
        });
      });

      describe('and required attributes are absent', () => {
        it('returns valid as false and an array of errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: {},
          });

          expect(valid).toBe(false);
          expect(errors).toBeInstanceOf(Array);
          expect(errors).toHaveLength(1);
          expect(errors[0].path).toBe('favoriteBook.name');
        });
      });

      describe('and nullable attributes receive null value', () => {
        it('returns valid as true and no errors', () => {
          const { valid, errors } = User.validate({
            name: 'some name',
            age: 25,
            favoriteBook: { name: null },
          });

          expect(valid).toBe(true);
          expect(errors).toBeUndefined();
        });
      });

      describe('and non nullable attributes receive null value', () => {
        let Test;

        beforeAll(() => {
          Test = attributes({ user: User })(class Test {});
        });

        it('returns valid as false and an array of errors', () => {
          const { valid, errors } = Test.validate({
            user: { name: null },
          });

          expect(valid).toBe(false);
          expect(errors).toBeInstanceOf(Array);
          expect(errors).toHaveLength(1);
          expect(errors[0].path).toBe('user.name');
        });
      });
    });

    describe('when passed data is a structure', () => {
      describe('when required attributes are present and valid', () => {
        it('returns valid as true and no errors', () => {
          const user = new User({
            name: 'Something',
            age: 21,
          });

          const { valid, errors } = User.validate(user);

          expect(valid).toBe(true);
          expect(errors).toBeUndefined();
        });
      });

      describe('when required attributes are absent or invalid', () => {
        it('returns valid as false and array of errors', () => {
          const user = new User({
            age: 10,
          });

          const { valid, errors } = User.validate(user);

          expect(valid).toBe(false);
          expect(errors).toBeInstanceOf(Array);
          expect(errors).toHaveLength(2);
          expect(errors[0].path).toBe('name');
          expect(errors[1].path).toBe('age');
        });
      });

      describe('and nullable attributes receive null value', () => {
        it('returns valid as true and no errors', () => {
          const user = new User({
            name: 'Something',
            age: 21,
            favoriteBook: new Book({ name: null }),
          });

          const { valid, errors } = User.validate(user);

          expect(valid).toBe(true);
          expect(errors).toBeUndefined();
        });
      });

      describe('and non nullable attributes receive null value', () => {
        let Test;

        beforeAll(() => {
          Test = attributes({ user: User })(class Test {});
        });

        it('returns valid as false and an array of errors', () => {
          const test = new Test({
            user: { name: null },
          });

          const { valid, errors } = Test.validate(test);

          expect(valid).toBe(false);
          expect(errors).toBeInstanceOf(Array);
          expect(errors).toHaveLength(1);
          expect(errors[0].path).toBe('user.name');
        });
      });
    });
  });
});
