const { attributes } = require('../../src/v2/src');

describe('creating a structure class', () => {
  describe('structure class is passed as the second parameter', () => {
    describe('when structure class has a name', () => {
      it('throws with a message with structure class name', () => {
        expect(() => {
          attributes({}, class User {});
        }).toThrow(/^You passed the structure class.*\(User\)`\./);
      });
    });

    describe('when structure class is anonymous', () => {
      it('throws with a message with generic structure name', () => {
        // It's like this because Babel gives the name _class
        // to anonymous classes and do function auto-naming,
        // breaking browser tests
        const anonymousClass = (() => function() {})();

        expect(() => {
          attributes({}, anonymousClass);
        }).toThrow(/^You passed the structure class.*\(StructureClass\)`\./);
      });
    });
  });

  describe('using class static methods and properties', () => {
    let User;

    beforeEach(() => {
      class RawUser {
        static staticMethod() {
          return 'I am on a static method';
        }
      }

      RawUser.staticProperty = 'I am a static property';

      User = attributes({
        name: String,
      })(RawUser);
    });

    it('has access to static methods and properties', () => {
      expect(User.staticMethod()).toBe('I am on a static method');
      expect(User.staticProperty).toBe('I am a static property');
    });
  });

  describe('using default values for attributes', () => {
    describe('when the provided default value is a function', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: { type: Number, default: () => 18 },
        })(class User {});
      });

      it('defines the attribute with the default value executing the function', () => {
        const user = new User();

        expect(user.age).toBe(18);
      });
    });

    describe('when the function default value uses another class attribute', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: String,
          surname: String,
          fullname: {
            type: String,
            default: (self) => `${self.name} ${self.surname}`,
          },
        })(class User {});
      });

      it('defines the attribute with the default value executing the function', () => {
        const user = new User({ name: 'Jack', surname: 'Sparrow' });

        expect(user.fullname).toBe('Jack Sparrow');
      });
    });

    describe('when the provided default value is a property', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: { type: Number, default: 18 },
        })(class User {});
      });

      it('defines the attribute with the default value of the property', () => {
        const user = new User();

        expect(user.age).toBe(18);
      });
    });
  });

  describe('when using dynamic attribute types', () => {
    it('allows to use dynamic values without breaking', () => {
      require('../fixtures/CircularUser');
      require('../fixtures/CircularBook');
    });

    it('breaks if there is no value for dynamic type', () => {
      expect(() => {
        require('../fixtures/BrokenCircularBook');
      }).toThrow('Missing dynamic type for attribute: owner');
    });
  });
});
