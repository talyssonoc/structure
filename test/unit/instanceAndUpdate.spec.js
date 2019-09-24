const { attributes } = require('../../src');

describe('instantiating a structure', () => {
  let User;

  beforeEach(() => {
    User = attributes({
      name: {
        type: String,
        default: 'Name',
      },
      password: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        default: (instance) => instance.name,
      },
      uuid: {
        type: String,
        default: (instance) => instance.getUuid(),
      },
      attrUsingMethodUsingAttr: {
        type: String,
        default: (instance) => instance.someMethod(),
      },
    })(
      class User {
        constructor() {
          this.userInstanceStuff = 'Stuff value';
        }

        userMethod() {
          return 'I am a user';
        }

        getUuid() {
          return 10;
        }

        someMethod() {
          return `Method => ${this.name}`;
        }
      }
    );
  });

  it('has access to instance methods', () => {
    const user = new User();

    expect(user.userMethod()).toBe('I am a user');
  });

  it('has access to instance attributes created on constructor', () => {
    const user = new User();

    expect(user.userInstanceStuff).toBe('Stuff value');
  });

  it('has attributes passed to constructor assigned to the object', () => {
    const user = new User({
      password: 'My password',
    });

    expect(user.password).toBe('My password');
  });

  it('does not mutate the attributes object passed to the constructor', () => {
    const attributesObject = {};

    new User(attributesObject);

    expect(Object.keys(attributesObject)).toHaveLength(0);
  });

  it('ignores invalid attributes passed to constructor', () => {
    const user = new User({
      invalid: 'I will be ignored',
    });

    expect(user.invalid).toBeUndefined();
  });

  it('reflects instance attributes to #attributes', () => {
    const user = new User({
      password: 'The password',
    });

    expect(user.password).toBe('The password');
    expect(user.attributes.password).toBe('The password');
  });

  describe('attributes initialization', () => {
    describe('default value', () => {
      describe('when attribute default value is a static value', () => {
        it('defaults to the static value', () => {
          const user = new User();

          expect(user.name).toBe('Name');
        });
      });

      describe('when attribute default value is a function', () => {
        it('calls the function using the instance of the object as parameter and perform coercion', () => {
          const user = new User();

          expect(user.uuid).toBe('10');
        });
      });

      describe('when attribute dynamic default uses a static defaultable attribute', () => {
        describe('when static defaultable attribute uses default value', () => {
          it('allows to access the value of that attribute', () => {
            const user = new User();

            expect(user.nickname).toBe('Name');
          });
        });

        describe('when static defaultable attribute has a value passed to it', () => {
          it('allows to access the value of that attribute', () => {
            const user = new User({ name: 'This is my name' });

            expect(user.nickname).toBe('This is my name');
          });
        });

        describe('when dynamic default uses a method that uses an attribute with default', () => {
          it('generates the default value properly', () => {
            const user = new User();

            expect(user.attrUsingMethodUsingAttr).toBe('Method => Name');
          });
        });
      });

      it('overwrites default value with passed value', () => {
        const user = new User({ name: 'Not the default' });

        expect(user.name).toBe('Not the default');
      });
    });

    describe('instantiating a structure with buildStrict', () => {
      describe('when object is invalid', () => {
        describe('when using default error class', () => {
          it('throws a default error', (done) => {
            let errorDetails = [
              {
                message: '"password" is required',
                path: ['password'],
              },
            ];

            try {
              User.buildStrict();
            } catch (error) {
              expect(error).toHaveProperty('details', errorDetails);
              done();
            }
          });
        });

        describe('when using custom error class', () => {
          let UserWithCustomError;
          let InvalidUser;

          beforeEach(() => {
            InvalidUser = class InvalidUser extends Error {
              constructor(errors) {
                super('There is something wrong with this user');
                this.errors = errors;
              }
            };

            UserWithCustomError = attributes(
              {
                name: {
                  type: String,
                  minLength: 3,
                },
              },
              {
                strictValidationErrorClass: InvalidUser,
              }
            )(class UserWithCustomError {});
          });

          it('throws a custom error', () => {
            expect(() => {
              UserWithCustomError.buildStrict({
                name: 'JJ',
              });
            }).toThrow('There is something wrong with this user');
          });
        });
      });

      describe('when object is valid', () => {
        it('return an intance', () => {
          const user = User.buildStrict({
            password: 'My password',
          });

          expect(user.password).toBe('My password');
        });
      });
    });
  });
});

describe.skip('instantiating a structure with dynamic attribute types', () => {
  let CircularUser;
  let CircularBook;

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
        owner: new CircularUser(),
      }),
    });

    const userTwo = new CircularUser({
      name: 'Circular user two',
      friends: [userOne],
    });

    expect(userOne).toBeInstanceOf(CircularUser);
    expect(userOne.favoriteBook).toBeInstanceOf(CircularBook);
    expect(userOne.favoriteBook.owner).toBeInstanceOf(CircularUser);
    expect(userTwo).toBeInstanceOf(CircularUser);
    expect(userTwo.friends[0]).toBeInstanceOf(CircularUser);
  });

  describe('with buildStrict', () => {
    describe('when object is invalid', () => {
      it('throw an error', (done) => {
        let errorDetails = [
          {
            message: '"pages" must be a number',
            path: ['favoriteBook', 'pages'],
          },
        ];

        try {
          CircularUser.buildStrict({
            name: 'Circular user one',
            friends: [],
            favoriteBook: new CircularBook({
              name: 'Brave new world',
              pages: 'twenty',
            }),
          });
        } catch (error) {
          expect(error).toHaveProperty('details', errorDetails);
          done();
        }
      });
    });
  });
});

describe('updating an instance', () => {
  let User;

  beforeEach(() => {
    User = attributes({
      name: String,
    })(class User {});
  });

  it('updates instance attribute value when assigned a new value', () => {
    const user = new User({
      name: 'My name',
    });

    user.name = 'New name';

    expect(user.name).toBe('New name');
  });

  it('reflects new value assigned to attribute on #attributes', () => {
    const user = new User({
      name: 'My name',
    });

    user.name = 'New name';

    expect(user.attributes.name).toBe('New name');
  });

  it('reflects new value assigned to #attributes on instance attribute', () => {
    const user = new User({
      name: 'My name',
    });

    user.attributes = {
      name: 'New name',
    };

    expect(user.name).toBe('New name');
  });

  it('does not throw if no attributes are passed when instantiating', () => {
    expect(() => {
      new User();
    }).not.toThrow(Error);
  });

  it('throws if value assigned to #attributes is not an object', () => {
    const user = new User({
      name: 'My name',
    });

    expect(() => {
      user.attributes = null;
    }).toThrow(/^#attributes can't be set to a non-object\.$/);
  });
});

describe.skip('updating a structure with dynamic attribute types', () => {
  let CircularUser;
  let CircularBook;

  beforeEach(() => {
    CircularUser = require('../fixtures/CircularUser');
    CircularBook = require('../fixtures/CircularBook');
  });

  it('updates instance attribute when assigned a new value', () => {
    const user = new CircularUser({
      favoriteBook: new CircularBook({
        name: 'Brave new world',
        owner: new CircularUser(),
      }),
    });

    user.favoriteBook = new CircularBook({
      name: '1984',
      owner: user,
    });

    expect(user.favoriteBook).toBeInstanceOf(CircularBook);
    expect(user.favoriteBook.owner).toBeInstanceOf(CircularUser);
    expect(user.favoriteBook.owner).toBe(user);
  });
});

describe('cloning an instance', () => {
  let User;
  let Book;

  beforeEach(() => {
    Book = attributes({
      name: {
        type: String,
        required: true,
      },
    })(class Book {});

    User = attributes({
      name: {
        type: String,
        required: true,
      },
      age: Number,
      favoriteBook: Book,
    })(class User {});
  });

  describe('when nothing is overwritten', () => {
    describe('when not passing overwrite object', () => {
      it('makes a shallow clone', () => {
        const user = new User({
          name: 'Me',
          favoriteBook: {
            name: 'The Silmarillion',
          },
        });

        const userClone = user.clone();

        expect(userClone.name).toBe('Me');
        expect(userClone.favoriteBook).toBe(user.favoriteBook);
      });
    });

    describe('when passing overwrite object', () => {
      it('makes a shallow clone', () => {
        const user = new User({
          name: 'Me',
          favoriteBook: {
            name: 'The Silmarillion',
          },
        });

        const userClone = user.clone({});

        expect(userClone.name).toBe('Me');
        expect(userClone.favoriteBook).toBe(user.favoriteBook);
      });
    });
  });

  describe('when overwritting attributes', () => {
    describe('when overwritting a primitive type attribute', () => {
      it('overwrites it, leaving other attributes untouched', () => {
        const user = new User({
          name: 'Me',
          favoriteBook: {
            name: 'The Silmarillion',
          },
        });

        const userClone = user.clone({
          name: 'Myself',
        });

        expect(userClone.name).toBe('Myself');
        expect(userClone.favoriteBook).toBe(user.favoriteBook);
      });

      describe('when overwritten attribute needs coercion', () => {
        it('coerces attribute', () => {
          const user = new User({
            name: 'Me',
            age: 42,
            favoriteBook: {
              name: 'The Silmarillion',
            },
          });

          const userClone = user.clone({
            age: '123',
          });

          expect(userClone.age).toBe(123);
        });
      });
    });

    describe('when overwritting a nested structure', () => {
      describe('when passing a new instance of the nested structure', () => {
        it('overwrites it, leaving other attributes untouched', () => {
          const user = new User({
            name: 'Me',
            favoriteBook: {
              name: 'The Silmarillion',
            },
          });

          const userClone = user.clone({
            favoriteBook: new Book({ name: 'The Lord of the Rings' }),
          });

          expect(userClone.name).toBe('Me');
          expect(userClone.favoriteBook).not.toBe(user.favoriteBook);
          expect(userClone.favoriteBook.name).toBe('The Lord of the Rings');
        });
      });

      describe('when passing the attributes of the nested structure', () => {
        it('coerces attribute to a new nested structure, overwrites it, and leave other attributes untouched', () => {
          const user = new User({
            name: 'Me',
            favoriteBook: {
              name: 'The Silmarillion',
            },
          });

          const userClone = user.clone({
            favoriteBook: { name: 'The Lord of the Rings' },
          });

          expect(userClone.name).toBe('Me');
          expect(userClone.favoriteBook).not.toBe(user.favoriteBook);
          expect(userClone.favoriteBook.name).toBe('The Lord of the Rings');
        });
      });
    });
  });

  describe('strict mode', () => {
    describe('when overwritten attributes are valid', () => {
      it('clones normally', () => {
        const user = new User({
          name: 'Me',
          favoriteBook: {
            name: 'The Silmarillion',
          },
        });

        const userClone = user.clone({ name: 'Me' }, { strict: true });

        expect(userClone.name).toBe('Me');
        expect(userClone.favoriteBook).toBe(user.favoriteBook);
      });
    });

    describe('when overwritten attributes are invalid', () => {
      describe('when primitive attribute is invalid', () => {
        it('throws an error', (done) => {
          const user = new User({
            name: 'Me',
            favoriteBook: {
              name: 'The Silmarillion',
            },
          });

          let errorDetails = [
            {
              message: '"name" is required',
              path: ['name'],
            },
          ];

          try {
            user.clone({ name: null }, { strict: true });
          } catch (error) {
            expect(error).toHaveProperty('details', errorDetails);
            done();
          }
        });
      });

      describe('when nested attribute is invalid', () => {
        describe('when passing a the attributes of the nested attribute', () => {
          it('throws an error', (done) => {
            const user = new User({
              name: 'Me',
              favoriteBook: {
                name: 'The Silmarillion',
              },
            });

            let errorDetails = [
              {
                message: '"favoriteBook.name" is required',
                path: ['favoriteBook', 'name'],
              },
            ];

            try {
              user.clone({ favoriteBook: {} }, { strict: true });
            } catch (error) {
              expect(error).toHaveProperty('details', errorDetails);
              done();
            }
          });
        });
      });
    });
  });
});
