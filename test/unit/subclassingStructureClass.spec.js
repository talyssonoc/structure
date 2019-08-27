const { expect } = require('chai');
const { attributes } = require('../../src');

describe('subclassing a structure with a POJO class', () => {
  var User;
  var Admin;

  beforeEach(() => {
    User = attributes({
      name: String,
    })(
      class User {
        constructor(attrs, userValue) {
          this.userValue = userValue;
          this.userStuff = 'User Stuff';
        }

        userMethod() {
          return 'I am a user';
        }
      }
    );

    Admin = class Admin extends User {
      constructor(attrs, userValue, otherValue) {
        super(attrs, userValue);
        this.adminValue = otherValue;
      }

      adminMethod() {
        return 'I am an admin';
      }
    };
  });

  describe('instantiating a structure subclass', () => {
    it('is instance of class and superclass', () => {
      const admin = new Admin({
        name: 'The Admin',
      });

      expect(admin).to.be.instanceOf(Admin);
      expect(admin).to.be.instanceOf(User);
    });

    it('has access to class and superclass methods', () => {
      const admin = new Admin({
        name: 'Me',
      });

      expect(admin.userMethod()).to.equal('I am a user');
      expect(admin.adminMethod()).to.equal('I am an admin');
    });

    it('has access to class and superclass properties', () => {
      const admin = new Admin(
        {
          name: 'Me',
        },
        'User Value',
        'Admin Value'
      );

      expect(admin.userStuff).to.equal('User Stuff');
      expect(admin.userValue).to.equal('User Value');
      expect(admin.adminValue).to.equal('Admin Value');
    });

    it('has attributes passed to constructor assigned to the object', () => {
      const admin = new Admin({
        name: 'Me',
      });

      expect(admin.name).to.equal('Me');
    });

    it('ignores invalid attributes passed to constructor', () => {
      const admin = new Admin({
        name: 'Myself',
        invalid: 'I will be ignored',
      });

      expect(admin.invalid).to.be.undefined;
    });

    it('reflects instance attributes to #attributes', () => {
      const admin = new Admin({
        name: 'Self',
      });

      expect(admin.name).to.equal('Self');
      expect(admin.attributes.name).to.equal('Self');
    });
  });

  describe('updating an instance of structure subclass', () => {
    it('updates instance attribute value when assigned a new value', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.name = 'New name';

      expect(admin.name).to.equal('New name');
    });

    it('reflects new value assigned to attribute on #attributes', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.name = 'New name';

      expect(admin.attributes.name).to.equal('New name');
    });

    it('reflects new value assigned to #attributes on instance attribute', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.attributes.name = 'New name';

      expect(admin.name).to.equal('New name');
    });
  });

  describe('using subclass static methods and properties', () => {
    var AdminStructure;

    beforeEach(() => {
      class RawUser {
        static staticMethod() {
          return 'I am on a static method';
        }
      }

      RawUser.staticProperty = 'I am a static property';

      const UserStructure = attributes({
        name: String,
      })(RawUser);

      AdminStructure = class AdminStructure extends UserStructure {
        static staticAdminMethod() {
          return 'I am also on a static method';
        }
      };

      AdminStructure.staticAdminProperty = 'I am also a static property';
    });

    it('has access to static methods and properties', () => {
      expect(AdminStructure.staticMethod()).to.equal('I am on a static method');
      expect(AdminStructure.staticProperty).to.equal('I am a static property');
      expect(AdminStructure.staticAdminMethod()).to.equal(
        'I am also on a static method'
      );
      expect(AdminStructure.staticAdminProperty).to.equal(
        'I am also a static property'
      );
    });
  });
});

describe('subclassing a structure with another structure', () => {
  var Admin;
  var User;

  beforeEach(() => {
    User = attributes({
      name: String,
      uuid: {
        type: String,
        default: () => 123,
      },
    })(class User {});

    Admin = attributes({
      level: Number,
      identifier: {
        type: String,
        default: (instance) => `Admin-${instance.uuid}`,
      },
    })(class Admin extends User {});
  });

  it('uses the extended schema', () => {
    const admin = new Admin({
      name: 'The admin',
      level: 3,
    });

    expect(admin.name).to.equal('The admin');
    expect(admin.level).to.equal(3);
  });

  it('is instance of class and superclass', () => {
    const admin = new Admin({
      name: 'The Admin',
    });

    expect(admin).to.be.instanceOf(Admin);
    expect(admin).to.be.instanceOf(User);
  });

  context('default value', () => {
    context(
      'when subclass uses an attribute from superclass to generate a default value',
      () => {
        context('when superclass uses default', () => {
          it('allows to access it properly', () => {
            const admin = new Admin();

            expect(admin.identifier).to.equal('Admin-123');
          });
        });

        context(
          'when a value is passed to superclass defaultable attribute',
          () => {
            it('allows to access it properly', () => {
              const admin = new Admin({ uuid: '321' });

              expect(admin.identifier).to.equal('Admin-321');
            });
          }
        );
      }
    );
  });
});
