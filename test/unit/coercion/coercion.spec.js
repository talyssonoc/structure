const { expect } = require('chai');
const { spy } = require('sinon');
const Coercion = require('../../../src/coercion/coercion');
const CoercionNumber = require('../../../src/coercion/number');
const CoercionDate = require('../../../src/coercion/date');

describe('Coercion', () => {
  describe('.execute', () => {
    let value, coercion, typeDescriptor;

    context('when value is undefined', () => {
      beforeEach(() => {
        value = undefined;
        coercion = null;
        typeDescriptor = null;
      });

      it('returns undefined', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).to.be.undefined;
      });
    });

    context('when value is null', () => {
      beforeEach(() => value = null);

      context('and attribute is nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          typeDescriptor = { nullable: true };
        });

        it('returns null', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).to.be.null;
        });
      });

      context('and attribute is not nullable', () => {
        beforeEach(() => {
          coercion = CoercionNumber;
          typeDescriptor = { nullable: false };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).to.be.eq(0);
        });
      });

      context('and default attribute is a dynamic value', () => {
        beforeEach(() => {
          coercion = CoercionDate;
          typeDescriptor = { nullable: false };
        });

        it('returns default value present on Coercion object', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).to.be.eql(new Date('1970-01-01T00:00:00Z'));
        });

        it('creates a new object instance for default value', () => {
          const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

          expect(executionResponse).not.to.be.eq(coercion.nullValue());
        });
      });
    });

    context('when value is already coerced to correct type', () => {
      beforeEach(() => {
        value = 42;
        coercion = CoercionNumber;
        typeDescriptor = null;

        spy(CoercionNumber, 'coerce');
      });

      afterEach(() => CoercionNumber.coerce.restore());

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).to.be.eq(42);
      });

      it('does not invoke #coerce function', () => {
        Coercion.execute(value, coercion, typeDescriptor);

        expect(coercion.coerce.called).to.be.false;
      });
    });

    context('when value is not coerced to correct type', () => {
      beforeEach(() => {
        value = '1008';
        coercion = CoercionNumber;
        typeDescriptor = null;
      });

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).to.be.eq(1008);
      });
    });
  });
});
