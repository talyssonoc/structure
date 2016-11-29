const { expect } = require('chai');
const { attributes } = require('../src');

describe('instantiating an structure', () => {
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

  it('does not throw if no attributes are passed when instantiating', () => {
    expect(() => {
      new User();
    }).to.not.throw(Error);
  });

  it('throws if value assigned to #attributes is not an object', () => {
    const user = new User({
      name: 'My name'
    });

    expect(() => {
      user.attributes = null;
    }).to.throw(Error, /^#attributes can't be set to a non-object\.$/);
  });
});
