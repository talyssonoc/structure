const { attributes } = require('../../../src');

describe('type coercion', () => {
  describe('String', () => {
    let User;

    beforeEach(() => {
      User = attributes({
        name: String,
        fatherName: {
          type: String,
          nullable: true,
        },
      })(class User {});
    });

    describe('when not nullable', () => {
      it('does not coerce if value is already a string', () => {
        const name = new String('Some name');

        const user = new User({ name });

        expect(user.name).not.toBe('Some name');
        expect(user.name).not.toBe(new String('Some name'));
        expect(user.name).toBe(name);
      });

      it('does not coerces undefined', () => {
        const user = new User({
          name: undefined,
        });

        expect(user.name).toBeUndefined();
      });

      it('coerces integer to string', () => {
        const user = new User({
          name: 10,
        });

        expect(user.name).toBe('10');
      });

      it('coerces float to string', () => {
        const user = new User({
          name: 10.42,
        });

        expect(user.name).toBe('10.42');
      });

      it('coerces null to empty string', () => {
        const user = new User({
          name: null,
        });

        expect(user.name).toBe('');
      });

      it('coerces boolean to string', () => {
        const user = new User({
          name: false,
        });

        expect(user.name).toBe('false');
      });

      it('coerces date to string', () => {
        const date = new Date();

        const user = new User({
          name: date,
        });

        expect(user.name).toBe(date.toString());
      });
    });

    describe('when nullable', () => {
      it('does not coerce if value is already a string', () => {
        const fatherName = new String('Some name');

        const user = new User({ fatherName });

        expect(user.fatherName).not.toBe('Some name');
        expect(user.fatherName).not.toBe(new String('Some name'));
        expect(user.fatherName).toBe(fatherName);
      });

      it('does not coerces undefined', () => {
        const user = new User({
          fatherName: undefined,
        });

        expect(user.fatherName).toBeUndefined();
      });

      it('does not coerces null', () => {
        const user = new User({
          fatherName: null,
        });

        expect(user.fatherName).toBeNull();
      });

      it('coerces integer to string', () => {
        const user = new User({
          fatherName: 10,
        });

        expect(user.fatherName).toBe('10');
      });

      it('coerces float to string', () => {
        const user = new User({
          fatherName: 10.42,
        });

        expect(user.fatherName).toBe('10.42');
      });

      it('coerces boolean to string', () => {
        const user = new User({
          fatherName: false,
        });

        expect(user.fatherName).toBe('false');
      });

      it('coerces date to string', () => {
        const date = new Date();

        const user = new User({
          fatherName: date,
        });

        expect(user.fatherName).toBe(date.toString());
      });
    });

    describe('coercing an object to string', () => {
      describe('when the object does not implement #toString()', () => {
        it('coerces object to object tag string', () => {
          const objectWithoutToString = { data: 42 };

          const user = new User({
            name: objectWithoutToString,
          });

          expect(user.name).toBe('[object Object]');
        });
      });

      describe('when the object implements #toString()', () => {
        it('coerces object to value returned from #toString()', () => {
          const objectWithToString = {
            data: 42,
            toString() {
              return this.data;
            },
          };

          const user = new User({
            name: objectWithToString,
          });

          expect(user.name).toBe('42');
        });
      });
    });
  });
});
