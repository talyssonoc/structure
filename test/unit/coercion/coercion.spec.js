const { expect } = require('chai');
const { spy } = require('sinon');
const Coercion = require('../../../src/coercion/coercion');
const CoercionNumber = require('../../../src/coercion/number');

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
      beforeEach(() => {
        value = null;
        coercion = CoercionNumber;
        typeDescriptor = null;
      });

      it('returns default value present on Coercion object', () => {
        const executionResponse = Coercion.execute(value, coercion, typeDescriptor);

        expect(executionResponse).to.be.eq(0);
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
