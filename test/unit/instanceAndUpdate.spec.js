const { expect } = require('chai');
const { attributes } = require('../../src');

describe('instantiating a structure', () => {
  var User;

  beforeEach(() => {
    User = attributes({
      name: String
    })(class User {
      constructor() {
        this.userInstanceStuff = 'Stuff value';
      }

      userMethod() {
        return 'I am a user';
      }
    });
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

  it('don\'t reflect the changes outside of the escope', () => {
    const rawUser = {};

    new User(rawUser);

    expect(rawUser).to.be.empty;
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

describe('instantiating a structure with dynamic attribute types', () => {
  var CircularUser;
  var CircularBook;

  beforeEach(() => {
    CircularUser = require('../fixtures/CircularUser');
    CircularBook = require('../fixtures/CircularBook');
  });

  it('creates instance properly', () => {
    const userOne = new CircularUser({
      name: 'Circular user one',
      friends: [],
      favoriteBook: new CircularBook({
        name: 'Brave new world',
        owner: new CircularUser()
      })
    });

    const userTwo = new CircularUser({
      name: 'Circular user two',
      friends: [userOne]
    });

    expect(userOne).to.be.instanceOf(CircularUser);
    expect(userOne.favoriteBook).to.be.instanceOf(CircularBook);
    expect(userOne.favoriteBook.owner).to.be.instanceOf(CircularUser);
    expect(userTwo).to.be.instanceOf(CircularUser);
    expect(userTwo.friends[0]).to.be.instanceOf(CircularUser);
  });
});

describe('updating an instance', () => {
  var User;

  beforeEach(() => {
    User = attributes({
      name: String
    })(class User {

    });
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
    }).to.throw(TypeError, /^#attributes can't be set to a non-object\.$/);
  });
});

describe('updating a structure with dynamic attribute types', () => {
  var CircularUser;
  var CircularBook;

  beforeEach(() => {
    CircularUser = require('../fixtures/CircularUser');
    CircularBook = require('../fixtures/CircularBook');
  });

  it('updates instance attribute when assigned a new value', () => {
    const user = new CircularUser({
      favoriteBook: new CircularBook({
        name: 'Brave new world',
        owner: new CircularUser()
      })
    });

    user.favoriteBook = new CircularBook({
      name: '1984',
      owner: user
    });

    expect(user.favoriteBook).to.be.instanceOf(CircularBook);
    expect(user.favoriteBook.owner).to.be.instanceOf(CircularUser);
    expect(user.favoriteBook.owner).to.equal(user);
  });
});
