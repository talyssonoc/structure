const Coercion = require('../../../src/coercion/coercion');
const CoercionNumber = require('../../../src/coercion/number');
const CoercionDate = require('../../../src/coercion/date');

describe('Coercion', () => {
  describe('.execute', () => {
    let value, coercion, typeDescriptor;

    describe('when value is undefined', () => {
      beforeEach(() => {
        value = undefined;
        coercion = null;
        typeDescriptor = null;
      });

      it('returns undefined', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).toBeUndefined();
      });
    });

    describe('when value is null', () => {
      beforeEach(() => (value = null));

      describe('and attribute is nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          typeDescriptor = { nullable: true };
        });

        it('returns null', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).toBeNull();
        });
      });

      describe('and attribute is not nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          typeDescriptor = { nullable: false };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).toBe(0);
        });
      });

      describe('and default attribute is a dynamic value', () => {
        beforeEach(() => {
          coercion = CoercionDate;
          typeDescriptor = { nullable: false };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).toEqual(new Date('1970-01-01T00:00:00Z'));
        });

        it('creates a new object instance for default value', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).not.toBe(coercion.nullValue());
        });
      });
    });

    describe('when value is already coerced to correct type', () => {
      let spy;

      beforeEach(() => {
        value = 42;
        coercion = CoercionNumber;
        typeDescriptor = null;

        spy = jest.spyOn(CoercionNumber, 'coerce');
      });

      afterEach(() => spy.mockRestore());

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).toBe(42);
      });

      it('does not invoke #coerce function', () => {
        Coercion.execute(value, coercion, typeDescriptor);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when value is not coerced to correct type', () => {
      beforeEach(() => {
        value = '1008';
        coercion = CoercionNumber;
        typeDescriptor = null;
      });

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).toBe(1008);
      });
    });
  });
});
