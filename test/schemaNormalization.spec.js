const { expect } = require('chai');
const normalizeSchema = require('../src/normalizeSchema');

describe('schema normalization', () => {
  context('when passed attribute is the type itself', () => {
    it('normalizes to an object with the type field being equal to the passed type', () => {
      const schema = {
        name: String
      };

      expect(normalizeSchema(schema).name.type).to.equal(String);
    });
  });

  context('when passed attribute is an object', () => {
    context('when attribute object has the field type', () => {
      it('normalizes to an object with the type field being equal to the passed type', () => {
        const schema = {
          name: { type: String }
        };

        expect(normalizeSchema(schema).name.type).to.equal(String);
      });
    });

    context('when attribute object does not have the field type', () => {
      it('throws an error', () => {
        const schema = {
          name: { something: 42 }
        };

        expect(() => {
          normalizeSchema(schema)
        }).to.throw(Error, /^Missing type for attribute: name$/);
      });
    });
  });

  context('when it is not possible to normalize the attribute', () => {
    it('normalizes to an object with the type field being equal to the passed type', () => {
      const schema = { name: 'invalid attribute' };

      expect(() => {
        normalizeSchema(schema)
      }).to.throw(Error, /^Invalid type for attribute: name$/);
    });
  });
});
