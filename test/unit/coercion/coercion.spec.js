const Coercion = require('../../../src/v2/src/coercion/coercion');
const CoercionNumber = require('../../../src/v2/src/coercion/coercions/number');
const CoercionDate = require('../../../src/v2/src/coercion/coercions/date');

describe('Coercion', () => {
  describe('.create', () => {
    let value, coercion, attributeDefinition;

    describe('when value is undefined', () => {
      beforeEach(() => {
        value = undefined;
        coercion = null;
        attributeDefinition = null;
      });

      it('returns undefined', () => {
        const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

        expect(executionResponse).toBeUndefined();
      });
    });

    describe('when value is null', () => {
      beforeEach(() => (value = null));

      describe('and attribute is nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          attributeDefinition = { options: { nullable: true } };
        });

        it('returns null', () => {
          const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

          expect(executionResponse).toBeNull();
        });
      });

      describe('and attribute is not nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          attributeDefinition = { options: { nullable: false } };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

          expect(executionResponse).toBe(0);
        });
      });

      describe('and default attribute is a dynamic value', () => {
        beforeEach(() => {
          coercion = CoercionDate;
          attributeDefinition = { options: { nullable: false } };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

          expect(executionResponse).toEqual(new Date('1970-01-01T00:00:00Z'));
        });

        it('creates a new object instance for default value', () => {
          const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

          expect(executionResponse).not.toBe(coercion.nullValue());
        });
      });
    });

    describe('when value is already coerced to correct type', () => {
      let spy;

      beforeEach(() => {
        value = 42;
        coercion = CoercionNumber;
        attributeDefinition = null;

        spy = jest.spyOn(CoercionNumber, 'coerce');
      });

      afterEach(() => spy.mockRestore());

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

        expect(executionResponse).toBe(42);
      });

      it('does not invoke #coerce function', () => {
        Coercion.create(value, coercion, attributeDefinition);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when value is not coerced to correct type', () => {
      beforeEach(() => {
        value = '1008';
        coercion = CoercionNumber;
        attributeDefinition = null;
      });

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.create(coercion, attributeDefinition).coerce(value);

        expect(executionResponse).toBe(1008);
      });
    });
  });
});
