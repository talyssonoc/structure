const { expect } = require('chai');
const { entity } = require('../src');

describe('entity', () => {
  describe('instantiating an entity', () => {
    const User = entity({
      name: String
    })(class User {
      constructor() {
        this.userInstanceStuff = 'Stuff value';
      }

      userMethod() {
        return 'I am a user';
      }
    });

    it('has access to instance methods', () => {
      const user = new User({
        name: 'Me'
      });

      expect(user.userMethod()).to.equal('I am a user');
    });

    it('has access to instance attributes created on constructor', () => {
      const user = new User({
        name: 'Me'
      });

      expect(user.userInstanceStuff).to.equal('Stuff value');
    });

    it('has attributes passed to constructor assigned to the object', () => {
      const user = new User({
        name: 'Me'
      });

      expect(user.name).to.equal('Me');
    });

    it('ignores invalid attributes passed to constructor', () => {
      const user = new User({
        name: 'Myself',
        invalid: 'I will be ignored'
      });

      expect(user.invalid).to.be.undefined;
    });

    it('reflects instance attributes to #attributes', () => {
      const user = new User({
        name: 'Self'
      });

      expect(user.name).to.equal('Self');
      expect(user.attributes.name).to.equal('Self');
    });
  });

  describe('updating an instance', () => {
    const User = entity({
      name: String
    })(class User {

    });

    it('updates instance attribute value when assigned a new value', () => {
      const user = new User({
        name: 'My name'
      });

      user.name = 'New name';

      expect(user.name).to.equal('New name');
    });

    it('reflects new value assigned to attribute on #attributes', () => {
      const user = new User({
        name: 'My name'
      });

      user.name = 'New name';

      expect(user.attributes.name).to.equal('New name');
    });

    it('reflects new value assigned to #attributes on instance attribute', () => {
      const user = new User({
        name: 'My name'
      });

      user.attributes.name = 'New name';

      expect(user.name).to.equal('New name');
    });
  });

  describe('subclassing an entity', () => {
    const User = entity({
      name: String
    })(class User {
      constructor(attrs, userValue) {
        this.userValue = userValue;
        this.userStuff = 'User Stuff';
      }

      userMethod() {
        return 'I am a user';
      }
    });

    class Admin extends User {
      constructor(attrs, userValue, otherValue) {
        super(attrs, userValue);
        this.adminValue = otherValue;
      }

      adminMethod() {
        return 'I am an admin';
      }
    }

    describe('instantiating an entity subclass', () => {
      it('is instance of class and superclass', () => {
        const admin = new Admin({
          name: 'The Admin'
        });

        expect(admin).to.be.instanceOf(Admin);
        expect(admin).to.be.instanceOf(User);
      });

      it('has access to class and superclass methods', () => {
        const admin = new Admin({
          name: 'Me'
        });

        expect(admin.userMethod()).to.equal('I am a user');
        expect(admin.adminMethod()).to.equal('I am an admin');
      });

      it('has access to class and superclass attributes', () => {
        const admin = new Admin({
          name: 'Me'
        }, 'User Value', 'Admin Value');

        expect(admin.userStuff).to.equal('User Stuff');
        expect(admin.userValue).to.equal('User Value');
        expect(admin.adminValue).to.equal('Admin Value');
      });

      it('has attributes passed to constructor assigned to the object', () => {
        const admin = new Admin({
          name: 'Me'
        });

        expect(admin.name).to.equal('Me');
      });

      it('ignores invalid attributes passed to constructor', () => {
        const admin = new Admin({
          name: 'Myself',
          invalid: 'I will be ignored'
        });

        expect(admin.invalid).to.be.undefined;
      });

      it('reflects instance attributes to #attributes', () => {
        const admin = new Admin({
          name: 'Self'
        });

        expect(admin.name).to.equal('Self');
        expect(admin.attributes.name).to.equal('Self');
      });
    });

    describe('updating an instance of entity subclass', () => {
      it('updates instance attribute value when assigned a new value', () => {
        const admin = new Admin({
          name: 'My name'
        });

        admin.name = 'New name';

        expect(admin.name).to.equal('New name');
      });

      it('reflects new value assigned to attribute on #attributes', () => {
        const admin = new Admin({
          name: 'My name'
        });

        admin.name = 'New name';

        expect(admin.attributes.name).to.equal('New name');
      });

      it('reflects new value assigned to #attributes on instance attribute', () => {
        const admin = new Admin({
          name: 'My name'
        });

        admin.attributes.name = 'New name';

        expect(admin.name).to.equal('New name');
      });
    });
  });
});
