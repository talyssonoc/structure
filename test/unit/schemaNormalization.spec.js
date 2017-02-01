const { expect } = require('chai');
const { normalizeSchema } = require('../../src/schemaNormalization');

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
          normalizeSchema(schema);
        }).to.throw(Error, /^Missing type for attribute: name\.$/);
      });
    });
  });

  context('when it is not possible to normalize the attribute', () => {
    context('when attribute type is not an object nor a constructor', () => {
      it('throws an error', () => {
        const schema = { name: true };

        expect(() => {
          normalizeSchema(schema);
        }).to.throw(TypeError, /^Invalid type for attribute: name\.$/);
      });
    });

    context('when attribute type is not an object but #type is not a constructor', () => {
      it('throws an error', () => {
        const schema = {
          name: {
            type: true
          }
        };

        expect(() => {
          normalizeSchema(schema);
        }).to.throw(TypeError, /^Attribute type must be a constructor: name\.$/);
      });
    });
  });

  context('when attribute has itemType', () => {
    context('when itemType is an object with type attribute', () => {
      it('does not change the itemType object', () => {
        const schema = {
          name: {
            type: Array,
            itemType: { type: String }
          }
        };

        expect(normalizeSchema(schema).name.itemType.type).to.eql(String);
      });
    });

    context('when itemType is a constructor', () => {
      it('normalizes itemType to an object with type field being equal to passed constructor', () => {
        const schema = {
          name: {
            type: Array,
            itemType: String
          }
        };

        expect(normalizeSchema(schema).name.itemType.type).to.eql(String);
      });
    });
  });
});
