const { attributes } = require('../../src/v2/src');

describe('subclassing a structure with a POJO class', () => {
  let User;
  let Admin;

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

      expect(admin).toBeInstanceOf(Admin);
      expect(admin).toBeInstanceOf(User);
    });

    it('has access to class and superclass methods', () => {
      const admin = new Admin({
        name: 'Me',
      });

      expect(admin.userMethod()).toBe('I am a user');
      expect(admin.adminMethod()).toBe('I am an admin');
    });

    it('has access to class and superclass properties', () => {
      const admin = new Admin(
        {
          name: 'Me',
        },
        'User Value',
        'Admin Value'
      );

      expect(admin.userStuff).toBe('User Stuff');
      expect(admin.userValue).toBe('User Value');
      expect(admin.adminValue).toBe('Admin Value');
    });

    it('has attributes passed to constructor assigned to the object', () => {
      const admin = new Admin({
        name: 'Me',
      });

      expect(admin.name).toBe('Me');
    });

    it('ignores invalid attributes passed to constructor', () => {
      const admin = new Admin({
        name: 'Myself',
        invalid: 'I will be ignored',
      });

      expect(admin.invalid).toBeUndefined();
    });

    it('reflects instance attributes to #attributes', () => {
      const admin = new Admin({
        name: 'Self',
      });

      expect(admin.name).toBe('Self');
      expect(admin.attributes.name).toBe('Self');
    });
  });

  describe('updating an instance of structure subclass', () => {
    it('updates instance attribute value when assigned a new value', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.name = 'New name';

      expect(admin.name).toBe('New name');
    });

    it('reflects new value assigned to attribute on #attributes', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.name = 'New name';

      expect(admin.attributes.name).toBe('New name');
    });

    it('reflects new value assigned to #attributes on instance attribute', () => {
      const admin = new Admin({
        name: 'My name',
      });

      admin.attributes.name = 'New name';

      expect(admin.name).toBe('New name');
    });
  });

  describe('using subclass static methods and properties', () => {
    let AdminStructure;

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
      expect(AdminStructure.staticMethod()).toBe('I am on a static method');
      expect(AdminStructure.staticProperty).toBe('I am a static property');
      expect(AdminStructure.staticAdminMethod()).toBe('I am also on a static method');
      expect(AdminStructure.staticAdminProperty).toBe('I am also a static property');
    });
  });
});

describe('subclassing a structure with another structure', () => {
  let Admin;
  let User;

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

    expect(admin.name).toBe('The admin');
    expect(admin.level).toBe(3);
  });

  it('is instance of class and superclass', () => {
    const admin = new Admin({
      name: 'The Admin',
    });

    expect(admin).toBeInstanceOf(Admin);
    expect(admin).toBeInstanceOf(User);
  });

  describe('default value', () => {
    describe('when subclass uses an attribute from superclass to generate a default value', () => {
      describe('when superclass uses default', () => {
        it('allows to access it properly', () => {
          const admin = new Admin();

          expect(admin.identifier).toBe('Admin-123');
        });
      });

      describe('when a value is passed to superclass defaultable attribute', () => {
        it('allows to access it properly', () => {
          const admin = new Admin({ uuid: '321' });

          expect(admin.identifier).toBe('Admin-321');
        });
      });
    });
  });
});

describe('subclassing a POJO class with a structure', () => {
  let Employee;
  let Writer;
  let Reviewer;

  beforeEach(() => {
    Employee = class Employee {
      getType() {
        return this.type.toUpperCase();
      }
    };

    Writer = attributes({ type: String })(class Writer extends Employee {});
    Reviewer = attributes({ type: String })(class Reviewer extends Employee {});
  });

  describe('when structure attribute is a structure which extends a POJO', () => {
    let Sector;

    beforeEach(() => {
      Sector = attributes({
        leader: Employee,
      })(class Sector {});
    });

    it('does not coerce if the attribute value is from subclass', () => {
      const writer = new Writer({ type: 'writer' });
      const writingSector = new Sector({ leader: writer });

      const reviewer = new Reviewer({ type: 'reviewer' });
      const reviewingSector = new Sector({ leader: reviewer });

      expect(writingSector.leader).toBeInstanceOf(Writer);
      expect(writingSector.leader.getType()).toBe('WRITER');

      expect(reviewingSector.leader).toBeInstanceOf(Reviewer);
      expect(reviewingSector.leader.getType()).toBe('REVIEWER');
    });
  });

  describe('when a structure attribute is an array of structures which extends a POJO', () => {
    let Company;

    beforeEach(() => {
      Company = attributes({
        employees: {
          type: Array,
          itemType: Employee,
        },
      })(class Company {});
    });

    it('does not coerce the items to the base class', () => {
      const writer = new Writer({ type: 'writer' });
      const reviewer = new Reviewer({ type: 'reviewer' });

      const company = new Company({
        employees: [writer, reviewer],
      });

      expect(company.employees[0]).toBeInstanceOf(Writer);
      expect(company.employees[0].getType()).toBe('WRITER');

      expect(company.employees[1]).toBeInstanceOf(Reviewer);
      expect(company.employees[1].getType()).toBe('REVIEWER');
    });
  });
});
