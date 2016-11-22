const { expect } = require('chai');
const { attributes } = require('../src');

describe('creating an entity class', () => {
  describe('entity class is passed as the second parameter', () => {
    context('when entity class has a name', () => {
      it('throws with a message with entity class name', () => {
        expect(() => {
          attributes({}, class User {});
        }).to.throw(Error, /^You passed the entity class.*\(User\)`\./);
      });
    });

    context('when entity class is anonymous', () => {
      it('throws with a message with generic entity name', () => {
        expect(() => {
          attributes({}, class {});
        }).to.throw(Error, /^You passed the entity class.*\(EntityClass\)`\./);
      });
    });
  });


  describe('using class static methods and properties', () => {
    class RawUser {
      static staticMethod() {
        return 'I am on a static method';
      }
    }

    RawUser.staticProperty = 'I am a static property';

    const User = attributes({
      name: String
    })(RawUser);

    it('has access to static methods and properties', () => {
      expect(User.staticMethod()).to.equal('I am on a static method');
      expect(User.staticProperty).to.equal('I am a static property');
    });
  });

  describe('using default values for attributes', () => {
    const defaultName = 'Foo';
    const defaultAge = () => 18;

    const User = attributes({
      name: { type: String, default: defaultName },
      age: { type: Number, default: defaultAge }
    })(class User {});

    it('should define the attributes with the default values', () => {
      const user = new User();

      expect(user.name).to.equal(defaultName);
      expect(user.age).to.equal(defaultAge());
    });
  });
});
