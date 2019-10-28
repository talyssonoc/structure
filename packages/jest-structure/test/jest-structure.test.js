const { attributes } = require('structure');
require('../auto');

describe('jest-structure', () => {
  let User;

  beforeEach(() => {
    const Book = attributes({
      name: {
        type: String,
        required: true,
      },
    })(class Book {});

    User = attributes({
      name: {
        type: String,
        required: true,
        minLength: 2,
        alphanumeric: true,
      },
      age: {
        type: Number,
        required: true,
        positive: true,
      },
      favoriteBook: Book,
    })(class User {});
  });

  describe('toBeValid', () => {
    it('suceeds for valid structures', () => {
      const user = new User({ name: 'abc', age: 42 });

      expect(user).toBeValid();
    });

    it('fails for invalid structures', () => {
      const user = new User();

      expect(() => {
        expect(user).toBeValid();
      }).toThrowErrorMatchingSnapshot();
    });

    describe('.not', () => {
      it('succeeds for invalid structures', () => {
        const user = new User();

        expect(user).not.toBeValid();
      });

      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).not.toBeValid();
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('toBeInvalid', () => {
    it('suceeds for invalid structures', () => {
      const user = new User();

      expect(user).toBeInvalid();
    });

    it('fails for valid structures', () => {
      const user = new User({ name: 'abc', age: 42 });

      expect(() => {
        expect(user).toBeInvalid();
      }).toThrowErrorMatchingSnapshot();
    });

    describe('.not', () => {
      it('succeeds for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(user).not.toBeInvalid();
      });

      it('fails for invalid structures', () => {
        const user = new User();

        expect(() => {
          expect(user).not.toBeInvalid();
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('toHaveInvalidAttribute', () => {
    it('can not be used with .not', () => {
      const user = new User();

      expect(() => {
        expect(user).not.toHaveInvalidAttribute(['name']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called without attribute path', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttribute();
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called with empty attribute path', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttribute([]);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('when only attribute path is passed', () => {
      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).toHaveInvalidAttribute(['name']);
        }).toThrowErrorMatchingSnapshot();
      });

      describe('when the attribute is the only one invalid', () => {
        it('succeeds ', () => {
          const user = new User({ age: 42 });

          expect(user).toHaveInvalidAttribute(['name']);
        });
      });

      describe('when the attribute is not the only one invalid', () => {
        it('succeeds ', () => {
          const user = new User({});

          expect(user).toHaveInvalidAttribute(['name']);
        });
      });

      describe('when the attribute is not the invalid one', () => {
        it('fails ', () => {
          const user = new User({ name: 'abc' });

          expect(() => {
            expect(user).toHaveInvalidAttribute(['name']);
          }).toThrowErrorMatchingSnapshot();
        });
      });
    });

    describe('when attribute path and error messages are passed', () => {
      it('fails for valid structures', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).toHaveInvalidAttribute(['name'], ['nope']);
        }).toThrowErrorMatchingSnapshot();
      });

      describe('when the attribute is the only one invalid', () => {
        describe('when the errors are passed the same order returned by validate()', () => {
          it('succeeds', () => {
            const user = new User({ name: '$', age: 42 });

            expect(user).toHaveInvalidAttribute(
              ['name'],
              [
                '"name" length must be at least 2 characters long',
                '"name" must only contain alpha-numeric characters',
              ]
            );
          });
        });

        describe('when the errors are passed in a order different from the one returned by validate()', () => {
          it('succeeds', () => {
            const user = new User({ name: '$', age: 42 });

            expect(user).toHaveInvalidAttribute(
              ['name'],
              [
                '"name" must only contain alpha-numeric characters',
                '"name" length must be at least 2 characters long',
              ]
            );
          });
        });

        describe('when the expected errors are a subset of the actual errors', () => {
          it('fails', () => {
            const user = new User({ name: '$', age: 42 });

            expect(() => {
              expect(user).toHaveInvalidAttribute(
                ['name'],
                ['"name" length must be at least 2 characters long']
              );
            }).toThrowErrorMatchingSnapshot();
          });
        });

        describe('when the expected errors are a superset of the actual errors', () => {
          it('fails', () => {
            const user = new User({ name: '$', age: 42 });

            expect(() => {
              expect(user).toHaveInvalidAttribute(
                ['name'],
                [
                  '"name" must only contain alpha-numeric characters',
                  '"name" is not from this planet',
                  '"name" length must be at least 2 characters long',
                ]
              );
            }).toThrowErrorMatchingSnapshot();
          });
        });

        describe('when using arrayContaining', () => {
          describe('when arrayContaining is a subset of the errors', () => {
            it('succeeds', () => {
              const user = new User({ name: '$', age: 42 });

              expect(user).toHaveInvalidAttribute(
                ['name'],
                expect.arrayContaining(['"name" length must be at least 2 characters long'])
              );
            });
          });

          describe('when arrayContaining is a superset of the errors', () => {
            it('fails', () => {
              const user = new User({ name: '$', age: 42 });

              expect(() => {
                expect(user).toHaveInvalidAttribute(
                  ['name'],
                  expect.arrayContaining([
                    '"name" must only contain alpha-numeric characters',
                    '"name" is not from this planet',
                    '"name" length must be at least 2 characters long',
                  ])
                );
              }).toThrowErrorMatchingSnapshot();
            });
          });

          describe('when arrayContaining has an intersection with the errors + other different errors', () => {
            it('fails', () => {
              const user = new User({ name: '$', age: 42 });

              expect(() => {
                expect(user).toHaveInvalidAttribute(
                  ['name'],
                  expect.arrayContaining([
                    '"name" is not from this planet',
                    '"name" length must be at least 2 characters long',
                  ])
                );
              }).toThrowErrorMatchingSnapshot();
            });
          });
        });
      });

      describe('when the attribute is not the only one invalid', () => {
        it('succeeds ', () => {
          const user = new User({});

          expect(user).toHaveInvalidAttribute(['name'], ['"name" is required']);
        });
      });

      describe('when the attribute is not the invalid one', () => {
        it('fails ', () => {
          const user = new User({ age: 42 });

          expect(() => {
            expect(user).toHaveInvalidAttribute(['age'], ['"age" is wrong']);
          }).toThrowErrorMatchingSnapshot();
        });
      });
    });
  });

  describe('toHaveInvalidAttributes', () => {
    it('can not be used with .not', () => {
      const user = new User();

      expect(() => {
        expect(user).not.toHaveInvalidAttributes([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called without the array of expected errors', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttributes();
      }).toThrowErrorMatchingSnapshot();
    });

    it('can not be called with empty array of expected errors', () => {
      const user = new User();

      expect(() => {
        expect(user).toHaveInvalidAttributes([]);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('when structure is valid', () => {
      it('fails', () => {
        const user = new User({ name: 'abc', age: 42 });

        expect(() => {
          expect(user).toHaveInvalidAttributes([{ path: ['name'] }]);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
