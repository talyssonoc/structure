const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('String', () => {
    describe('no validation', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String
          },
          fatherName: {
            type: String,
            nullable: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            name: undefined
          });

          assertValid(user);
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            fatherName: null
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      var User;

      context('when value is present', () => {
        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              required: true
            }
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              required: true
            }
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            name: undefined
          });

          assertInvalid(user, 'name');
        });
      });

      context('when value is null', () => {
        context('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              name: {
                type: String,
                required: true,
                nullable: true
              }
            })(class User {});
          });

          it('is valid', () => {
            user = new User({ name: null });

            assertValid(user);
          });
        });

        context('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              name: {
                type: String,
                required: true,
                nullable: false
              }
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            user = new User({ name: null });

            assertInvalid(user, 'name');
          });
        });
      });
    });

    describe('not required', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            required: false
          }
        })(class User {});
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            name: undefined
          });

          assertValid(user);
        });
      });
    });

    describe('equal', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            equal: 'Something'
          }
        })(class User {});
      });

      context('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Something'
          });

          assertValid(user);
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Another thing'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('empty', () => {
      describe('empty: true', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              empty: true
            }
          })(class User {});
        });

        context('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name'
            });

            assertValid(user);
          });
        });

        context('when value is empty', () => {
          it('is valid', () => {
            const user = new User({
              name: ''
            });

            assertValid(user);
          });
        });
      });

      describe('empty: false', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              empty: false
            }
          })(class User {});
        });

        context('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name'
            });

            assertValid(user);
          });
        });

        context('when value is empty', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              name: ''
            });

            assertInvalid(user, 'name');
          });
        });
      });
    });

    describe('minLength', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            minLength: 3
          }
        })(class User {});
      });

      context('when value has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          assertValid(user);
        });
      });

      context('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('maxLength', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            maxLength: 4
          }
        })(class User {});
      });

      context('when value has maximum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some'
          });

          assertValid(user);
        });
      });

      context('when value is longer than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('exactLength', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            exactLength: 4
          }
        })(class User {});
      });

      context('when value has exact length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some'
          });

          assertValid(user);
        });
      });

      context('when value is longer than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name'
          });

          assertInvalid(user, 'name');
        });
      });

      context('when value is shorter than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('regex', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            regex: /\w\d/
          }
        })(class User {});
      });

      context('when value matches the regex', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1'
          });

          assertValid(user);
        });
      });

      context('when value does not match the regex', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Something'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('alphanumeric', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            alphanumeric: true
          }
        })(class User {});
      });

      context('when value is alphanumeric', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1B2'
          });

          assertValid(user);
        });
      });

      context('when value is not alphanumeric', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'No alphanumeric $ string'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('lowerCase', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            lowerCase: true
          }
        })(class User {});
      });

      context('when value is lower cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'abc'
          });

          assertValid(user);
        });
      });

      context('when value has some upper case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('upperCase', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            upperCase: true
          }
        })(class User {});
      });

      context('when value is upper cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'ABC'
          });

          assertValid(user);
        });
      });

      context('when value has some lower case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('email', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            email: true
          }
        })(class User {});
      });

      context('when value is a valid email', () => {
        it('is valid', () => {
          const user = new User({
            name: 'name@host.com'
          });

          assertValid(user);
        });
      });

      context('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Not a valid email'
          });

          assertInvalid(user, 'name');
        });
      });
    });

    describe('guid', () => {
      context('when validating as a generic guid', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            id: {
              type: String,
              guid: true
            }
          })(class User {});
        });

        context('when value is a valid guid', () => {
          it('is valid', () => {
            const user = new User({
              id: '759535af-3314-4ace-81b9-a519c29d0e17'
            });

            assertValid(user);
          });
        });

        context('when value is not a valid guid', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              id: 'Not a valid guid'
            });

            assertInvalid(user, 'id');
          });
        });
      });

      context('when validating a specific guid version', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            id: {
              type: String,
              guid: {
                version: ['uuidv4']
              }
            }
          })(class User {});
        });

        context('when value is a valid guid', () => {
          it('is valid', () => {
            const uuidv4 = 'f35e1cf1-4ac9-4fbb-9c06-151dc8ff9107';

            const user = new User({
              id: uuidv4
            });

            assertValid(user);
          });
        });

        context('when value is not a valid guid', () => {
          it('is not valid and has errors set', () => {
            const uuidv1 = 'c130564e-36d9-11e9-b210-d663bd873d93';

            const user = new User({
              id: uuidv1
            });

            assertInvalid(user, 'id');
          });
        });
      });
    });
  });
});
