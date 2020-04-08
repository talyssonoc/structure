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
      attrWithCustomSetter: String,
      attrWithCustomGetter: String,
      attrWithCustomSetterAndGetter: String,
      attrUsingMethodUsingAttr: {
        type: String,
        default: (instance) => instance.someMethod(),
      },
      nullableWithoutDefault: {
        type: String,
        nullable: true,
      },
      nullableWithDefault: {
        type: String,
        default: 'The Default',
        nullable: true,
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

        set attrWithCustomSetter(value) {
          this.set('attrWithCustomSetter', value);
        }

        get attrWithCustomGetter() {
          return this.get('attrWithCustomGetter');
        }

        set attrWithCustomSetterAndGetter(value) {
          this.set('attrWithCustomSetterAndGetter', `${value}...`);
        }

        get attrWithCustomSetterAndGetter() {
          return `-> ${this.get('attrWithCustomSetterAndGetter')}`;
        }
      }
    );
  });

  it('has access to instance methods', () => {
    const user = new User();

    expect(user.userMethod()).toEqual('I am a user');
  });

  it('has access to instance attributes created on constructor', () => {
    const user = new User();

    expect(user.userInstanceStuff).toEqual('Stuff value');
  });

  it('has attributes passed to constructor assigned to the object', () => {
    const user = new User({
      password: 'My password',
    });

    expect(user.password).toEqual('My password');
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

    expect(user.password).toEqual('The password');
    expect(user.attributes.password).toEqual('The password');
  });

  describe('attributes initialization', () => {
    describe('default value', () => {
      describe('when attribute is non-nullable and has static default', () => {
        describe('when passed value is undefined', () => {
          it('defaults to the static value', () => {
            const user = new User();

            expect(user.name).toEqual('Name');
          });
        });

        describe('when passed value is null', () => {
          it('defaults to the static value', () => {
            const user = new User({ name: null });

            expect(user.name).toEqual('Name');
          });
        });
      });

      describe('when attribute is non-nullable and default value is a function', () => {
        describe('when passed value is undefined', () => {
          it('calls the function using the instance of the object as parameter and perform coercion', () => {
            const user = new User();

            expect(user.uuid).toEqual('10');
          });
        });

        describe('when passed value is null', () => {
          it('calls the function using the instance of the object as parameter and perform coercion', () => {
            const user = new User({ uuid: null });

            expect(user.uuid).toEqual('10');
          });
        });
      });

      describe('when attribute dynamic default uses a static defaultable attribute', () => {
        describe('when static defaultable attribute uses default value', () => {
          it('allows to access the value of that attribute', () => {
            const user = new User();

            expect(user.nickname).toEqual('Name');
          });
        });

        describe('when static defaultable attribute has a value passed to it', () => {
          it('allows to access the value of that attribute', () => {
            const user = new User({ name: 'This is my name' });

            expect(user.nickname).toEqual('This is my name');
          });
        });

        describe('when dynamic default uses a method that uses an attribute with default', () => {
          it('generates the default value properly', () => {
            const user = new User();

            expect(user.attrUsingMethodUsingAttr).toEqual('Method => Name');
          });
        });
      });

      describe('when attribute is nullable and has a default', () => {
        describe('when passed value is undefined', () => {
          it('uses default', () => {
            const user = new User({});

            expect(user.nullableWithDefault).toEqual('The Default');
          });
        });

        describe('when passed value is null', () => {
          it('leaves it as null', () => {
            const user = new User({ nullableWithDefault: null });

            expect(user.nullableWithDefault).toBeNull();
          });
        });
      });

      describe('when attribute is nullable and has no default', () => {
        describe('when passed value is undefined', () => {
          it('leaves it as undefined', () => {
            const user = new User({});

            expect(user.nullableWithoutDefault).toEqual(undefined);
          });
        });

        describe('when passed value is null', () => {
          it('leaves it as null', () => {
            const user = new User({ nullableWithoutDefault: null });

            expect(user.nullableWithoutDefault).toBeNull();
          });
        });
      });

      it('overwrites default value with passed value', () => {
        const user = new User({ name: 'Not the default' });

        expect(user.name).toEqual('Not the default');
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
                type: 'any.required',
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

          expect(user.password).toEqual('My password');
        });
      });
    });
  });

  describe('custom setters and getters', () => {
    describe('when attribute that has a custom setter is set', () => {
      it('calls custom setter', () => {
        const user = new User({ attrWithCustomSetter: 'abc' });

        expect(user.attrWithCustomSetter).toBe('abc');
      });

      it('does coercion to the set value', () => {
        const user = new User({ attrWithCustomSetter: 42 });

        expect(user.attrWithCustomSetter).toBe('42');
      });
    });

    describe('when attribute that has a custom getter is requested', () => {
      it('calls custom getter', () => {
        const user = new User({ attrWithCustomGetter: 'abc' });

        expect(user.attrWithCustomGetter).toBe('abc');
      });
    });

    describe('when attribute has custom setter and getter', () => {
      it('calls setter when setting', () => {
        const user = new User({ attrWithCustomSetterAndGetter: 'a' });

        expect(user.attributes.attrWithCustomSetterAndGetter).toEqual('a...');
      });

      it('calls getter when getting', () => {
        const user = new User({ attrWithCustomSetterAndGetter: 'a' });

        expect(user.attrWithCustomSetterAndGetter).toEqual('-> a...');
      });
    });

    describe('when tries to set an attribute that does not exist', () => {
      it('fails and throws an error', () => {
        const User = attributes({
          name: String,
        })(
          class User {
            set name(value) {
              this.set('NOPE', `> ${value}`);
            }
          }
        );

        expect(() => {
          new User({ name: 'hmm...' });
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});

describe('instantiating a structure with dynamic attribute types', () => {
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
            message: '"favoriteBook.pages" must be a number',
            path: ['favoriteBook', 'pages'],
            type: 'number.base',
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
      age: Number,
      nickname: String,
    })(
      class User {
        set nickname(newNickname) {
          this.set('nickname', `> ${newNickname} <`);
        }
      }
    );
  });

  it('updates instance attribute value when assigned a new value', () => {
    const user = new User({
      name: 'My name',
    });

    user.name = 'New name';

    expect(user.name).toEqual('New name');
  });

  it('reflects new value assigned to attribute on #attributes', () => {
    const user = new User({
      name: 'My name',
    });

    user.name = 'New name';

    expect(user.attributes.name).toEqual('New name');
  });

  it('reflects and coerces new values assigned to #attributes on instance attribute', () => {
    const user = new User({
      name: 'My name',
    });

    user.attributes = {
      name: 'New name',
      age: '123',
    };

    expect(user.name).toBe('New name');
    expect(user.age).toBe(123);
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

  it('uses custom setter', () => {
    const user = new User({});

    user.nickname = 'ABC';

    expect(user.nickname).toBe('> ABC <');
  });
});

describe('updating a structure with dynamic attribute types', () => {
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

        expect(userClone.name).toEqual('Me');
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

        expect(userClone.name).toEqual('Me');
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

        expect(userClone.name).toEqual('Myself');
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

          expect(userClone.age).toEqual(123);
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

          expect(userClone.name).toEqual('Me');
          expect(userClone.favoriteBook).not.toBe(user.favoriteBook);
          expect(userClone.favoriteBook.name).toEqual('The Lord of the Rings');
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

          expect(userClone.name).toEqual('Me');
          expect(userClone.favoriteBook).not.toBe(user.favoriteBook);
          expect(userClone.favoriteBook.name).toEqual('The Lord of the Rings');
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

        expect(userClone.name).toEqual('Me');
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
              type: 'any.required',
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
                type: 'any.required',
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
