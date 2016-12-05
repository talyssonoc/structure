const { expect } = require('chai');
const { attributes } = require('../../../src');

describe('validation', () => {
  describe('Number', () => {
    describe('no validation', () => {
      const User = attributes({
        age: {
          type: Number
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            age: undefined
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        age: {
          type: Number,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: undefined
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('equal', () => {
      describe('when using a value', () => {
        const User = attributes({
          age: {
            type: Number,
            equal: 2
          }
        })(class User {});

        context('when value is equal', () => {
          it('is valid', () => {
            const user = new User({
              age: 2
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('age');
          });
        });
      });

      describe('when using a mixed array os possibilities', () => {
        const User = attributes({
          startAge: {
            type: Number
          },
          currentAge: {
            type: Number,
            equal: [{ attr: 'startAge' }, 3]
          }
        })(class User {});

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is equal to one of the value possibilities', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is different from all possibilities', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('currentAge');
          });
        });
      });

      describe('when using a reference', () => {
        const User = attributes({
          startAge: {
            type: Number
          },
          currentAge: {
            type: Number,
            equal: { attr: 'startAge' }
          }
        })(class User {});

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is different', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 1,
              currentAge: 2
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('currentAge');
          });
        });
      });
    });

    describe('min', () => {
      describe('when using a number', () => {
        const User = attributes({
          age: {
            type: Number,
            min: 2
          }
        })(class User {});

        context('when value is equal to min', () => {
          it('is valid', () => {
            const user = new User({
              age: 2
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is greater than min', () => {
          it('is valid', () => {
            const user = new User({
              age: 3
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is less than min', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              age: 1
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('age');
          });
        });
      });

      describe('when using a reference to another attribute', () => {
        const User = attributes({
          startAge: {
            type: Number
          },
          currentAge: {
            type: Number,
            min: { attr: 'startAge' }
          }
        })(class User {});

        context('when value is equal to referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 2
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is greater than referenced attribute', () => {
          it('is valid', () => {
            const user = new User({
              startAge: 2,
              currentAge: 3
            });

            expect(user.isValid()).to.be.true;
            expect(user.errors).to.be.undefined;
          });
        });

        context('when value is less than referenced attribute', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              startAge: 3,
              currentAge: 2
            });

            expect(user.isValid()).to.be.false;
            expect(user.errors).to.be.instanceOf(Array);
            expect(user.errors).to.have.lengthOf(1);
            expect(user.errors[0].path).to.equal('currentAge');
          });
        });
      });
    });

    describe('greater', () => {
      const User = attributes({
        age: {
          type: Number,
          greater: 2
        }
      })(class User {});

      context('when value is equal to greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });

      context('when value is greater than greater', () => {
        it('is valid', () => {
          const user = new User({
            age: 3
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is less than greater', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('max', () => {
      const User = attributes({
        age: {
          type: Number,
          max: 2
        }
      })(class User {});

      context('when value is equal to max', () => {
        it('is valid', () => {
          const user = new User({
            age: 2
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is less than max', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is greater than max', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('less', () => {
      const User = attributes({
        age: {
          type: Number,
          less: 2
        }
      })(class User {});

      context('when value is equal to less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 2
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });

      context('when value is less than less', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is greater than less', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 3
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('integer', () => {
      const User = attributes({
        age: {
          type: Number,
          integer: true
        }
      })(class User {});

      context('when value is an integer', () => {
        it('is valid', () => {
          const user = new User({
            age: 42
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not an integer', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 4.2
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('precision', () => {
      const User = attributes({
        age: {
          type: Number,
          precision: 2
        }
      })(class User {});

      context('when value has less than precision decimal places', () => {
        it('is valid', () => {
          const user = new User({
            age: 4.20
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value has more than precision decimal places', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0.042
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('multiple', () => {
      const User = attributes({
        age: {
          type: Number,
          multiple: 3
        }
      })(class User {});

      context('when value is multiple of given value', () => {
        it('is valid', () => {
          const user = new User({
            age: 6
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is not multiple of given value', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 7
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('positive', () => {
      const User = attributes({
        age: {
          type: Number,
          positive: true
        }
      })(class User {});

      context('when value is positive', () => {
        it('is valid', () => {
          const user = new User({
            age: 1
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });

      context('when value is negative', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: -1
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });

    describe('negative', () => {
      const User = attributes({
        age: {
          type: Number,
          negative: true
        }
      })(class User {});

      context('when value is negative', () => {
        it('is valid', () => {
          const user = new User({
            age: -1
          });

          expect(user.isValid()).to.be.true;
          expect(user.errors).to.be.undefined;
        });
      });

      context('when value is zero', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 0
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });

      context('when value is positive', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            age: 1
          });

          expect(user.isValid()).to.be.false;
          expect(user.errors).to.be.instanceOf(Array);
          expect(user.errors).to.have.lengthOf(1);
          expect(user.errors[0].path).to.equal('age');
        });
      });
    });
  });
});
