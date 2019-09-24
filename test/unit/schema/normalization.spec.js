const { normalize } = require('../../../src/schema');

describe('schema normalization', () => {
  describe('when passed attribute is the type itself', () => {
    it('normalizes to an object with the type field being equal to the passed type', () => {
      const schema = {
        name: String,
      };

      expect(normalize(schema).name.type).toBe(String);
    });
  });

  describe('when passed attribute is an object', () => {
    describe('when attribute object has the field type', () => {
      it('normalizes to an object with the type field being equal to the passed type', () => {
        const schema = {
          name: { type: String },
        };

        expect(normalize(schema).name.type).toBe(String);
      });
    });
  });

  describe('when it is not possible to normalize the attribute', () => {
    describe('when attribute type is not an object nor a constructor', () => {
      it('throws an error', () => {
        const schema = { name: true };

        expect(() => {
          normalize(schema);
        }).toThrow(
          /^Attribute type must be a constructor or the name of a dynamic type: name\.$/
        );
      });
    });

    describe('when attribute descriptor is complete but #type is not a constructor', () => {
      it('throws an error', () => {
        const schema = {
          name: {
            type: true,
          },
        };

        expect(() => {
          normalize(schema);
        }).toThrow(
          /^Attribute type must be a constructor or the name of a dynamic type: name\.$/
        );
      });
    });
  });

  describe('when attribute has itemType', () => {
    describe('when itemType is an object with type attribute', () => {
      it('does not change the itemType object', () => {
        const schema = {
          name: {
            type: Array,
            itemType: { type: String },
          },
        };

        expect(normalize(schema).name.itemType.type).toEqual(String);
      });
    });

    describe('when itemType is a constructor', () => {
      it('normalizes itemType to an object with type field being equal to passed constructor', () => {
        const schema = {
          name: {
            type: Array,
            itemType: String,
          },
        };

        expect(normalize(schema).name.itemType.type).toEqual(String);
      });
    });
  });
});
