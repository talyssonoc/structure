const { attributes } = require('structure');
require('../auto');

describe('jest-structure', () => {
  let User;

  beforeEach(() => {
    User = attributes({
      name: {
        type: String,
        required: true,
        minLength: 2,
      },
      age: {
        type: Number,
        required: true,
        positive: true,
      },
    })(class User {});
  });

  describe('toBeValid', () => {
    it('suceeds for valid structures', () => {
      const user = new User({ name: 'abc', age: 42 });

      expect(user).toBeValid();
    });

    it('fails for invalid structures', () => {
      const user = new User();

      expect(() => {
        expect(user).toBeValid();
      }).toThrowErrorMatchingSnapshot();
    });

    describe('.not', () => {
      it('succeeds for invalid structures', () => {
        const user = new User();

        expect(user).not.toBeValid();
      });

      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).not.toBeValid();
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('toBeInvalid', () => {
    it('suceeds for invalid structures', () => {
      const user = new User();

      expect(user).toBeInvalid();
    });

    it('fails for valid structures', () => {
      const user = new User({ name: 'abc', age: 42 });

      expect(() => {
        expect(user).toBeInvalid();
      }).toThrowErrorMatchingSnapshot();
    });

    describe('.not', () => {
      it('succeeds for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(user).not.toBeInvalid();
      });

      it('fails for invalid structures', () => {
        const user = new User();

        expect(() => {
          expect(user).not.toBeInvalid();
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('toHaveInvalidAttribute', () => {
    it('can not be used with .not', () => {
      const user = new User();

      expect(() => {
        expect(user).not.toHaveInvalidAttribute(['name']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called without attribute path', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttribute();
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called with empty attribute path', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttribute();
      }).toThrowErrorMatchingSnapshot([]);
    });

    describe('when only attribute path is passed', () => {
      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).toHaveInvalidAttribute(['name']);
        }).toThrowErrorMatchingSnapshot();
      });

      describe('when the attribute is the only one invalid', () => {
        it('succeeds ', () => {
          const user = new User({ age: 42 });

          expect(user).toHaveInvalidAttribute(['name']);
        });
      });

      describe('when the attribute is not the only one invalid', () => {
        it('succeeds ', () => {
          const user = new User({});

          expect(user).toHaveInvalidAttribute(['name']);
        });
      });

      describe('when the attribute is not invalid', () => {
        it('fails ', () => {
          const user = new User({ name: 'abc' });

          expect(() => {
            expect(user).toHaveInvalidAttribute(['name']);
          }).toThrowErrorMatchingSnapshot();
        });
      });
    });

    describe('when attribute path and error messages are passed', () => {
      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).toHaveInvalidAttribute(['name'], ['nope']);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
