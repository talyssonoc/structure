const { attributes } = require('../../../src');

describe('coercion feature switch', () => {
  describe('when using for the whole structure', () => {
    describe('explicitly enabled', () => {
      let User;

      beforeEach(() => {
        User = attributes(
          {
            name: String,
          },
          {
            coercion: true,
          }
        )(class User {});
      });

      it('coerces attribute', () => {
        const user = new User({ name: 42 });

        expect(user.name).toEqual('42');
      });
    });

    describe('enabled by default', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: String,
        })(class User {});
      });

      it('coerces attribute', () => {
        const user = new User({ name: 42 });

        expect(user.name).toEqual('42');
      });
    });

    describe('disabled', () => {
      let User;

      beforeEach(() => {
        User = attributes(
          {
            name: String,
          },
          {
            coercion: false,
          }
        )(class User {});
      });

      it('does not coerce attribute', () => {
        const user = new User({ name: 42 });

        expect(user.name).toEqual(42);
      });

      it('fails validation because of wrong type', () => {
        const user = new User({ name: 42 });

        expect(user).toHaveInvalidAttribute(['name'], ['"name" must be a string']);
      });
    });
  });

  describe('when using for a single attribute', () => {
    describe('enabled', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: { type: String, coercion: true },
          age: Number,
        })(class User {});
      });

      it('coerces attribute', () => {
        const user = new User({ name: 42 });

        expect(user.name).toEqual('42');
      });
    });

    describe('disabled', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: { type: String, coercion: false },
          age: Number,
        })(class User {});
      });

      it('does not coerce attribute', () => {
        const user = new User({ name: 42 });

        expect(user.name).toEqual(42);
      });

      it('fails validation because of wrong type', () => {
        const user = new User({ name: 42 });

        expect(user).toHaveInvalidAttribute(['name'], ['"name" must be a string']);
      });
    });

    describe('overrides the schema', () => {
      describe('schema: disabled, attribute: enabled', () => {
        let User;

        beforeEach(() => {
          User = attributes(
            {
              name: { type: String, coercion: true },
              age: Number,
            },
            {
              coercion: false,
            }
          )(class User {});
        });

        it('coerces the attribute but not the others', () => {
          const user = new User({ name: 42, age: '1' });

          expect(user.name).toEqual('42');
          expect(user.age).toEqual('1');
        });

        it('fails validation because of wrong type of other attributes', () => {
          const user = new User({ name: 42, age: '1' });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a number']);
        });
      });

      describe('schema: enabled, attribute: disabled', () => {
        let User;

        beforeEach(() => {
          User = attributes(
            {
              name: { type: String, coercion: false },
              age: Number,
            },
            {
              coercion: true,
            }
          )(class User {});
        });

        it('does not coerce the attribute but coerces the others', () => {
          const user = new User({ name: 42, age: '1' });

          expect(user.name).toEqual(42);
          expect(user.age).toEqual(1);
        });

        it('fails validation because of wrong type', () => {
          const user = new User({ name: 42, age: '1' });

          expect(user).toHaveInvalidAttribute(['name'], ['"name" must be a string']);
        });
      });
    });
  });
});
