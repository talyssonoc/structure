const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('structure subclass', () => {
    var Admin;
    var User;

    beforeEach(() => {
      User = attributes({
        name: {
          type: String,
          required: true
        }
      })(class User {});

      Admin = attributes({
        level: {
          type: Number,
          required: true
        }
      })(class Admin extends User {});
    });

    context('with invalid superclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          level: 3
        });

        assertInvalid(admin, 'name');
      });
    });

    context('with invalid subclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          name: 'The admin'
        });

        assertInvalid(admin, 'level');
      });
    });

    context('with valid superclass and subclass schema', () => {
      it('is valid', () => {
        const admin = new Admin({
          name: 'The admin',
          level: 3
        });

        assertValid(admin);
      });
    });
  });
});
