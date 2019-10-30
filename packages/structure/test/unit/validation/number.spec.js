const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Number', () => {
    describe('no validation', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
          },
          earnings: {
            type: Number,
            nullable: true,
          },
        })(class User {});
      });

      describe('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            age: 42,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            age: undefined,
          });

          expect(user).toBeValid();
        });

        it('is valid with null when nullable', () => {
          const user = new User({
            earnings: null,
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
            age: {
              type: Number,
              required: true,
            },
          })(class User {});
        });

        it('is valid', () => {
          const user = new User({
            age: 42,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not present', () => {
        beforeEach(() => {
          User = attributes({
            age: {
              type: Number,
              required: true,
            },
          })(class User {});
        });

        it('is not valid and has errors set', () => {
          const user = new User({
            age: undefined,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" is required']);
        });
      });

      describe('when value is null', () => {
        describe('and attribute is nullable', () => {
          beforeEach(() => {
            User = attributes({
              age: {
                type: Number,
                required: true,
                nullable: true,
              },
            })(class User {});
          });

          it('is valid', () => {
            const user = new User({ age: null });

            expect(user).toBeValid();
          });
        });

        describe('and attribute is not nullable', () => {
          beforeEach(() => {
            User = attributes({
              age: {
                type: Number,
                required: true,
                nullable: false,
              },
            })(class User {});
          });

          it('is not valid and has errors set', () => {
            const user = new User({ age: null });

            expect(user).toHaveInvalidAttribute(['age'], ['"age" is required']);
          });
        });
      });
    });

    describe('not required', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            required: false,
          },
        })(class User {});
      });

      describe('when value is not present', () => {
        it('is valid', () => {
          const user = new User();

          expect(user).toBeValid();
        });
      });
    });

    describe('equal', () => {
      describe('when using a value', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            age: {
              type: Number,
              equal: 2,
            },
          })(class User {});
        });

        describe('when value is equal', () => {
          it('is valid', () => {
            const user = new User({
              age: 2,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1,
            });

            expect(user).toHaveInvalidAttribute(['age'], ['"age" must be [2]']);
          });
        });
      });

      describe('when using a mixed array os possibilities', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number,
            },
            currentAge: {
              type: Number,
              equal: [{ attr: 'startAge' }, 3],
            },
          })(class User {});
        });

        describe('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is equal to one of the value possibilities', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is different from all possibilities', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2,
            });

            expect(user).toHaveInvalidAttribute(
              ['currentAge'],
              ['"currentAge" must be one of [3, ref:startAge]']
            );
          });
        });
      });

      describe('when using a reference', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number,
            },
            currentAge: {
              type: Number,
              equal: { attr: 'startAge' },
            },
          })(class User {});
        });

        describe('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2,
            });

            expect(user).toHaveInvalidAttribute(
              ['currentAge'],
              ['"currentAge" must be [ref:startAge]']
            );
          });
        });
      });
    });

    describe('min', () => {
      describe('when using a number', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            age: {
              type: Number,
              min: 2,
            },
          })(class User {});
        });

        describe('when value is equal to min', () => {
          it('is valid', () => {
            const user = new User({
              age: 2,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is greater than min', () => {
          it('is valid', () => {
            const user = new User({
              age: 3,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is less than min', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1,
            });

            expect(user).toHaveInvalidAttribute(
              ['age'],
              ['"age" must be larger than or equal to 2']
            );
          });
        });
      });

      describe('when using a reference to another attribute', () => {
        let User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number,
            },
            currentAge: {
              type: Number,
              min: { attr: 'startAge' },
            },
          })(class User {});
        });

        describe('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is greater than referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3,
            });

            expect(user).toBeValid();
          });
        });

        describe('when value is less than referenced attribute', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 3,
              currentAge: 2,
            });

            expect(user).toHaveInvalidAttribute(
              ['currentAge'],
              ['"currentAge" must be larger than or equal to ref:startAge']
            );
          });
        });
      });
    });

    describe('greater', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            greater: 2,
          },
        })(class User {});
      });

      describe('when value is equal to greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be greater than 2']);
        });
      });

      describe('when value is greater than greater', () => {
        it('is valid', () => {
          const user = new User({
            age: 3,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is less than greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be greater than 2']);
        });
      });
    });

    describe('max', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            max: 2,
          },
        })(class User {});
      });

      describe('when value is equal to max', () => {
        it('is valid', () => {
          const user = new User({
            age: 2,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is less than max', () => {
        it('is valid', () => {
          const user = new User({
            age: 1,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is greater than max', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be less than or equal to 2']);
        });
      });
    });

    describe('less', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            less: 2,
          },
        })(class User {});
      });

      describe('when value is equal to less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be less than 2']);
        });
      });

      describe('when value is less than less', () => {
        it('is valid', () => {
          const user = new User({
            age: 1,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is greater than less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be less than 2']);
        });
      });
    });

    describe('integer', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            integer: true,
          },
        })(class User {});
      });

      describe('when value is an integer', () => {
        it('is valid', () => {
          const user = new User({
            age: 42,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not an integer', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 4.2,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be an integer']);
        });
      });
    });

    describe('precision', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            precision: 2,
          },
        })(class User {});
      });

      describe('when value has less than precision decimal places', () => {
        it('is valid', () => {
          const user = new User({
            age: 4.2,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value has more than precision decimal places', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0.042,
          });

          expect(user).toHaveInvalidAttribute(
            ['age'],
            ['"age" must have no more than 2 decimal places']
          );
        });
      });
    });

    describe('multiple', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            multiple: 3,
          },
        })(class User {});
      });

      describe('when value is multiple of given value', () => {
        it('is valid', () => {
          const user = new User({
            age: 6,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is not multiple of given value', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 7,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a multiple of 3']);
        });
      });
    });

    describe('positive', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            positive: true,
          },
        })(class User {});
      });

      describe('when value is positive', () => {
        it('is valid', () => {
          const user = new User({
            age: 1,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a positive number']);
        });
      });

      describe('when value is negative', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: -1,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a positive number']);
        });
      });
    });

    describe('negative', () => {
      let User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            negative: true,
          },
        })(class User {});
      });

      describe('when value is negative', () => {
        it('is valid', () => {
          const user = new User({
            age: -1,
          });

          expect(user).toBeValid();
        });
      });

      describe('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a negative number']);
        });
      });

      describe('when value is positive', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1,
          });

          expect(user).toHaveInvalidAttribute(['age'], ['"age" must be a negative number']);
        });
      });
    });
  });
});
