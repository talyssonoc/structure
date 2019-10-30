const { attributes } = require('../../../src');

describe('validation', () => {
  describe('String', () => {
    describe('no validation', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
          },
          fatherName: {
            type: String,
            nullable: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            name: undefined,
          });

          expect(user).toBeValid();
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            fatherName: null,
          });

          expect(user).toBeValid();
        });
      });
    });

    describe('required', () => {
      let User;

      describe('when value is present', () => {
        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              required: true,
            },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            name: 'Some name',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              required: true,
            },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            name: undefined,
          });

          expect(user).toHaveInvalidAttribute(['name'], ['"name" is required']);
        });
      });

      describe('when value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              name: {
                type: String,
                required: true,
                nullable: true,
              },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({ name: null });

            expect(user).toBeValid();
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              name: {
                type: String,
                required: true,
                nullable: false,
              },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({ name: null });

            expect(user).toHaveInvalidAttribute(['name'], ['"name" is required']);
          });
        });
      });
    });

    describe('not required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            required: false,
          },
        })(class User {});
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            name: undefined,
          });

          expect(user).toBeValid();
        });
      });
    });

    describe('equal', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            equal: 'Something',
          },
        })(class User {});
      });

      describe('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Something',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Another thing',
          });

          expect(user).toHaveInvalidAttribute(['name'], ['"name" must be [Something]']);
        });
      });
    });

    describe('empty', () => {
      describe('empty: true', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              empty: true,
            },
          })(class User {});
        });

        describe('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name',
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is empty', () => {
          it('is valid', () => {
            const user = new User({
              name: '',
            });

            expect(user).toBeValid();
          });
        });
      });

      describe('empty: false', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            name: {
              type: String,
              empty: false,
            },
          })(class User {});
        });

        describe('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name',
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is empty', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              name: '',
            });

            expect(user).toHaveInvalidAttribute(['name'], ['"name" is not allowed to be empty']);
          });
        });
      });
    });

    describe('minLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            minLength: 3,
          },
        })(class User {});
      });

      describe('when value has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" length must be at least 3 characters long']
          );
        });
      });
    });

    describe('maxLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            maxLength: 4,
          },
        })(class User {});
      });

      describe('when value has maximum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is longer than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" length must be less than or equal to 4 characters long']
          );
        });
      });
    });

    describe('exactLength', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            exactLength: 4,
          },
        })(class User {});
      });

      describe('when value has exact length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is longer than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" length must be 4 characters long']
          );
        });
      });

      describe('when value is shorter than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" length must be 4 characters long']
          );
        });
      });
    });

    describe('regex', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            regex: /\w\d/,
          },
        })(class User {});
      });

      describe('when value matches the regex', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value does not match the regex', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Something',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" with value "Something" fails to match the required pattern: /\\w\\d/']
          );
        });
      });
    });

    describe('alphanumeric', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            alphanumeric: true,
          },
        })(class User {});
      });

      describe('when value is alphanumeric', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1B2',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not alphanumeric', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'No alphanumeric $ string',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" must only contain alpha-numeric characters']
          );
        });
      });
    });

    describe('lowerCase', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            lowerCase: true,
          },
        })(class User {});
      });

      describe('when value is lower cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'abc',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value has some upper case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" must only contain lowercase characters']
          );
        });
      });
    });

    describe('upperCase', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            upperCase: true,
          },
        })(class User {});
      });

      describe('when value is upper cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'ABC',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value has some lower case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc',
          });

          expect(user).toHaveInvalidAttribute(
            ['name'],
            ['"name" must only contain uppercase characters']
          );
        });
      });
    });

    describe('email', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          name: {
            type: String,
            email: true,
          },
        })(class User {});
      });

      describe('when value is a valid email', () => {
        it('is valid', () => {
          const user = new User({
            name: 'name@host.com',
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Not a valid email',
          });

          expect(user).toHaveInvalidAttribute(['name'], ['"name" must be a valid email']);
        });
      });
    });

    describe('guid', () => {
      describe('when validating as a generic guid', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            id: {
              type: String,
              guid: true,
            },
          })(class User {});
        });

        describe('when value is a valid guid', () => {
          it('is valid', () => {
            const user = new User({
              id: '759535af-3314-4ace-81b9-a519c29d0e17',
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is not a valid guid', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              id: 'Not a valid guid',
            });

            expect(user).toHaveInvalidAttribute(['id'], ['"id" must be a valid GUID']);
          });
        });
      });

      describe('when validating a specific guid version', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            id: {
              type: String,
              guid: {
                version: ['uuidv4'],
              },
            },
          })(class User {});
        });

        describe('when value is a valid guid', () => {
          it('is valid', () => {
            const uuidv4 = 'f35e1cf1-4ac9-4fbb-9c06-151dc8ff9107';

            const user = new User({
              id: uuidv4,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is not a valid guid', () => {
          it('is not valid and has errors set', () => {
            const uuidv1 = 'c130564e-36d9-11e9-b210-d663bd873d93';

            const user = new User({
              id: uuidv1,
            });

            expect(user).toHaveInvalidAttribute(['id'], ['"id" must be a valid GUID']);
          });
        });
      });
    });
  });
});
