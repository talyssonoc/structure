const { expect } = require('chai');
const { attributes } = require('../../src');

describe('creating a structure class', () => {
  describe('structure class is passed as the second parameter', () => {
    context('when structure class has a name', () => {
      it('throws with a message with structure class name', () => {
        expect(() => {
          attributes({}, class User {});
        }).to.throw(Error, /^You passed the structure class.*\(User\)`\./);
      });
    });

    context('when structure class is anonymous', () => {
      it('throws with a message with generic structure name', () => {
        // It's like this because Babel gives the name _class
        // to anonymous classes and do function auto-naming,
        // breaking browser tests
        const anonymousClass = (() => function() {})();

        expect(() => {
          attributes({}, anonymousClass);
        }).to.throw(Error, /^You passed the structure class.*\(StructureClass\)`\./);
      });
    });
  });

  describe('using class static methods and properties', () => {
    var User;

    beforeEach(() => {
      class RawUser {
        static staticMethod() {
          return 'I am on a static method';
        }
      }

      RawUser.staticProperty = 'I am a static property';

      User = attributes({
        name: String
      })(RawUser);
    });

    it('has access to static methods and properties', () => {
      expect(User.staticMethod()).to.equal('I am on a static method');
      expect(User.staticProperty).to.equal('I am a static property');
    });
  });

  describe('using default values for attributes', () => {
    context('when the provided default value is a function', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: { type: Number, default: () => 18 }
        })(class User {});
      });

      it('defines the attribute with the default value executing the function', () => {
        const user = new User();

        expect(user.age).to.equal(18);
      });
    });

    context('when the function default value uses another class attribute', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: String,
          surname: String,
          fullname: {
            type: String,
            default: (self) => `${self.name} ${self.surname}`
          }
        })(class User {});
      });

      it('defines the attribute with the default value executing the function', () => {
        const user = new User({ name: 'Jack', surname: 'Sparrow' });

        expect(user.fullname).to.equal('Jack Sparrow');
      });
    });

    context('when the provided default value is a property', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: { type: Number, default: 18 }
        })(class User {});
      });

      it('defines the attribute with the default value of the property', () => {
        const user = new User();

        expect(user.age).to.equal(18);
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
      }).to.throw(Error, 'Missing dynamic type for attribute: owner');
    });
  });
});
