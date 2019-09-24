const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('structure subclass', () => {
    let Admin;
    let User;

    beforeEach(() => {
      User = attributes({
        name: {
          type: String,
          required: true,
        },
      })(class User {});

      Admin = attributes({
        level: {
          type: Number,
          required: true,
        },
      })(class Admin extends User {});
    });

    context('with invalid superclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          level: 3,
        });

        assertInvalid(admin, 'name');
      });
    });

    context('with invalid subclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          name: 'The admin',
        });

        assertInvalid(admin, 'level');
      });
    });

    context('with valid superclass and subclass schema', () => {
      it('is valid', () => {
        const admin = new Admin({
          name: 'The admin',
          level: 3,
        });

        assertValid(admin);
      });
    });

    context('with nullable attributes on superclass', () => {
      let Vehicle;
      let Car;

      context('when nullable is true', () => {
        beforeEach(() => {
          Vehicle = attributes({
            name: {
              type: String,
              required: true,
              nullable: true,
            },
          })(class Vehicle {});

          Car = attributes({
            gearbox: String,
          })(class Car extends Vehicle {});
        });

        it('is valid', () => {
          const car = new Car({ name: null });

          assertValid(car);
        });
      });

      context('when nullable is false', () => {
        beforeEach(() => {
          Vehicle = attributes({
            name: {
              type: String,
              required: true,
              nullable: false,
            },
          })(class Vehicle {});

          Car = attributes({
            gearbox: String,
          })(class Car extends Vehicle {});
        });

        it('is not valid and has errors set', () => {
          const car = new Car({ name: null });

          assertInvalid(car, 'name');
        });
      });
    });
  });
});
