const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('String', () => {
    describe('no validation', () => {
      const User = attributes({
        name: {
          type: String
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            name: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        name: {
          type: String,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: undefined
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('equal', () => {
      const User = attributes({
        name: {
          type: String,
          equal: 'Something'
        }
      })(class User {});

      context('when value is equal', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Something'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is different', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Another thing'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('empty', () => {
      describe('empty: true', () => {
        const User = attributes({
          name: {
            type: String,
            empty: true
          }
        })(class User {});

        context('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name'
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
          });
        });

        context('when value is empty', () => {
          it('is valid', () => {
            const user = new User({
              name: ''
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
          });
        });
      });

      describe('empty: false', () => {
        const User = attributes({
          name: {
            type: String,
            empty: false
          }
        })(class User {});

        context('when value is not empty', () => {
          it('is valid', () => {
            const user = new User({
              name: 'Some name'
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.true;
            expect(errors).to.be.undefined;
          });
        });

        context('when value is empty', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              name: ''
            });

            const { valid, errors } = user.validate();

            expect(valid).to.be.false;
            expect(errors).to.be.instanceOf(Array);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].path).to.equal('name');
          });
        });
      });

    });

    describe('minLength', () => {
      const User = attributes({
        name: {
          type: String,
          minLength: 3
        }
      })(class User {});

      context('when value has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some name'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('maxLength', () => {
      const User = attributes({
        name: {
          type: String,
          maxLength: 4
        }
      })(class User {});

      context('when value has maximum length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is longer than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('exactLength', () => {
      const User = attributes({
        name: {
          type: String,
          exactLength: 4
        }
      })(class User {});

      context('when value has exact length', () => {
        it('is valid', () => {
          const user = new User({
            name: 'Some'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is longer than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Some name'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });

      context('when value is shorter than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Hi'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('regex', () => {
      const User = attributes({
        name: {
          type: String,
          regex: /\w\d/
        }
      })(class User {});

      context('when value matches the regex', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value does not match the regex', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Something'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('alphanumeric', () => {
      const User = attributes({
        name: {
          type: String,
          alphanumeric: true
        }
      })(class User {});

      context('when value is alphanumeric', () => {
        it('is valid', () => {
          const user = new User({
            name: 'A1B2'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is not alphanumeric', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'No alphanumeric $ string'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('lowerCase', () => {
      const User = attributes({
        name: {
          type: String,
          lowerCase: true
        }
      })(class User {});

      context('when value is lower cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'abc'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value has some upper case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('upperCase', () => {
      const User = attributes({
        name: {
          type: String,
          upperCase: true
        }
      })(class User {});

      context('when value is upper cased', () => {
        it('is valid', () => {
          const user = new User({
            name: 'ABC'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value has some lower case character', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Abc'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });

    describe('email', () => {
      const User = attributes({
        name: {
          type: String,
          email: true
        }
      })(class User {});

      context('when value is a valid email', () => {
        it('is valid', () => {
          const user = new User({
            name: 'name@host.com'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.true;
          expect(errors).to.be.undefined;
        });
      });

      context('when value is shorter than minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            name: 'Not a valid email'
          });

          const { valid, errors } = user.validate();

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('name');
        });
      });
    });
  });
});
