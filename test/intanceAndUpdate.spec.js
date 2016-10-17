const { expect } = require('chai');
const { attributes } = require('../src');

describe('instantiating an entity', () => {
  const User = attributes({
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

  context('when entity constructor writes to some attribute', () => {
    const UserEntity = attributes({
      name: String
    })(class User {
      constructor() {
        this.name = 'Old name';
        this.userInstanceStuff = 'Stuff value';
      }

      userMethod() {
        return 'I am a user';
      }
    });

    it('overrides value set on the constructor', () => {
      const user = new UserEntity({
        name: 'New name'
      });

      expect(user.name).to.equal('New name');
    });
  });
});

describe('updating an instance', () => {
  const User = attributes({
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

    user.attributes = {
      name: 'New name'
    };

    expect(user.name).to.equal('New name');
  });
});
