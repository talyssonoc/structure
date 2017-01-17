const { attributes } = require('../../../src');
const { expect } = require('chai');

describe('validation', () => {
  describe('Using structure static method', () => {
    var User;

    before(() => {
      User = attributes({
        name: {
          type: String,
          required: true
        },
        age: {
          type: Number,
          min: 21
        }
      })(class User { });
    });

    context('when data is valid', () => {
      it('returns valid as true and no errors', () => {
        const { valid, errors } = User.validate({
          name: 'The name',
          age: 25
        });

        expect(valid).to.be.true;
        expect(errors).to.be.undefined;
      });
    });

    context('when data is invalid', () => {
      it('returns valid as false and array of errors', () => {
        const { valid, errors } = User.validate({
          age: 10
        });

        expect(valid).to.be.false;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.lengthOf(2);
        expect(errors[0].path).to.equal('name');
        expect(errors[1].path).to.equal('age');
      });
    });

    context('when passed data is a structure', () => {
      context('when structure is valid', () => {
        it('returns valid as true and no errors', () => {
          const user = new User({
            name: 'Something',
            age: 18
          });

          const { valid, errors } = User.validate(user);

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0].path).to.equal('age');
        });
      });

      context('when structure is invalid', () => {
        it('returns valid as false and array of errors', () => {
          const user = new User({
            age: 10
          });

          const { valid, errors } = User.validate(user);

          expect(valid).to.be.false;
          expect(errors).to.be.instanceOf(Array);
          expect(errors).to.have.lengthOf(2);
          expect(errors[0].path).to.equal('name');
          expect(errors[1].path).to.equal('age');
        });
      });
    });
  });
});
