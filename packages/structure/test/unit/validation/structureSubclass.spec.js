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

    describe('with invalid superclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          level: 3,
        });

        assertInvalid(admin, ['name']);
      });
    });

    describe('with invalid subclass schema', () => {
      it('is invalid', () => {
        const admin = new Admin({
          name: 'The admin',
        });

        assertInvalid(admin, ['level']);
      });
    });

    describe('with valid superclass and subclass schema', () => {
      it('is valid', () => {
        const admin = new Admin({
          name: 'The admin',
          level: 3,
        });

        expect(admin).toBeValid();
      });
    });

    describe('with nullable attributes on superclass', () => {
      let Vehicle;
      let Car;

      describe('when nullable is true', () => {
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

          expect(car).toBeValid();
        });
      });

      describe('when nullable is false', () => {
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

          assertInvalid(car, ['name']);
        });
      });
    });
  });
});
