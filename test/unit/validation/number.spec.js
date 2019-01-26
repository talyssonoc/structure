const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Number', () => {
    describe('no validation', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number
          },
          earnings: {
            type: Number,
            nullable: true,
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid with undefined', () => {
          const user = new User({
            age: undefined
          });

          assertValid(user);
        });
        it('is valid with null when nullable', () => {
          const user = new User({
            earnings: null
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            required: true
          }
        })(class User {});
      });

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: undefined
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('equal', () => {
      describe('when using a value', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            age: {
              type: Number,
              equal: 2
            }
          })(class User {});
        });

        context('when value is equal', () => {
          it('is valid', () => {
            const user = new User({
              age: 2
            });

            assertValid(user);
          });
        });

        context('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1
            });

            assertInvalid(user, 'age');
          });
        });
      });

      describe('when using a mixed array os possibilities', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number
            },
            currentAge: {
              type: Number,
              equal: [{ attr: 'startAge' }, 3]
            }
          })(class User {});
        });

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            assertValid(user);
          });
        });

        context('when value is equal to one of the value possibilities', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3
            });

            assertValid(user);
          });
        });

        context('when value is different from all possibilities', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2
            });

            assertInvalid(user, 'currentAge');
          });
        });
      });

      describe('when using a reference', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number
            },
            currentAge: {
              type: Number,
              equal: { attr: 'startAge' }
            }
          })(class User {});
        });

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            assertValid(user);
          });
        });

        context('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2
            });

            assertInvalid(user, 'currentAge');
          });
        });
      });
    });

    describe('min', () => {
      describe('when using a number', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            age: {
              type: Number,
              min: 2
            }
          })(class User {});
        });

        context('when value is equal to min', () => {
          it('is valid', () => {
            const user = new User({
              age: 2
            });

            assertValid(user);
          });
        });

        context('when value is greater than min', () => {
          it('is valid', () => {
            const user = new User({
              age: 3
            });

            assertValid(user);
          });
        });

        context('when value is less than min', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1
            });

            assertInvalid(user, 'age');
          });
        });
      });

      describe('when using a reference to another attribute', () => {
        var User;

        beforeEach(() => {
          User = attributes({
            startAge: {
              type: Number
            },
            currentAge: {
              type: Number,
              min: { attr: 'startAge' }
            }
          })(class User {});
        });

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            assertValid(user);
          });
        });

        context('when value is greater than referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3
            });

            assertValid(user);
          });
        });

        context('when value is less than referenced attribute', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 3,
              currentAge: 2
            });

            assertInvalid(user, 'currentAge');
          });
        });
      });
    });

    describe('greater', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            greater: 2
          }
        })(class User {});
      });

      context('when value is equal to greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2
          });

          assertInvalid(user, 'age');
        });
      });

      context('when value is greater than greater', () => {
        it('is valid', () => {
          const user = new User({
            age: 3
          });

          assertValid(user);
        });
      });

      context('when value is less than greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('max', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            max: 2
          }
        })(class User {});
      });

      context('when value is equal to max', () => {
        it('is valid', () => {
          const user = new User({
            age: 2
          });

          assertValid(user);
        });
      });

      context('when value is less than max', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          assertValid(user);
        });
      });

      context('when value is greater than max', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('less', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            less: 2
          }
        })(class User {});
      });

      context('when value is equal to less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2
          });

          assertInvalid(user, 'age');
        });
      });

      context('when value is less than less', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          assertValid(user);
        });
      });

      context('when value is greater than less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('integer', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            integer: true
          }
        })(class User {});
      });

      context('when value is an integer', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          assertValid(user);
        });
      });

      context('when value is not an integer', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 4.2
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('precision', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            precision: 2
          }
        })(class User {});
      });

      context('when value has less than precision decimal places', () => {
        it('is valid', () => {
          const user = new User({
            age: 4.20
          });

          assertValid(user);
        });
      });

      context('when value has more than precision decimal places', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0.042
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('multiple', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            multiple: 3
          }
        })(class User {});
      });

      context('when value is multiple of given value', () => {
        it('is valid', () => {
          const user = new User({
            age: 6
          });

          assertValid(user);
        });
      });

      context('when value is not multiple of given value', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 7
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('positive', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            positive: true
          }
        })(class User {});
      });

      context('when value is positive', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          assertValid(user);
        });
      });

      context('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0
          });

          assertInvalid(user, 'age');
        });
      });

      context('when value is negative', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: -1
          });

          assertInvalid(user, 'age');
        });
      });
    });

    describe('negative', () => {
      var User;

      beforeEach(() => {
        User = attributes({
          age: {
            type: Number,
            negative: true
          }
        })(class User {});
      });

      context('when value is negative', () => {
        it('is valid', () => {
          const user = new User({
            age: -1
          });

          assertValid(user);
        });
      });

      context('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0
          });

          assertInvalid(user, 'age');
        });
      });

      context('when value is positive', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1
          });

          assertInvalid(user, 'age');
        });
      });
    });
  });
});
