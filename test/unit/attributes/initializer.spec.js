const { expect } = require('chai');
const Initializer = require('../../../src/attributes/initializer');

describe('Initializer', () => {
  let attributeDescriptor, instance;

  describe('.nativesInitializer', () => {
    context('when default attribute is a raw value', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns true', () => {
          expect(Initializer.nativesInitializer.shouldInitialize(attributeDescriptor)).to.be.equal(true);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns default value', () => {
          expect(Initializer.nativesInitializer.getValue(attributeDescriptor, {})).to.be.equal('xyz');
        });
      });
    });

    context('when default attribute is a function', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns false', () => {
          expect(Initializer.nativesInitializer.shouldInitialize(attributeDescriptor)).to.be.equal(false);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns the same function', () => {
          expect(Initializer.nativesInitializer.getValue(attributeDescriptor, {})).to.be.a('function');
        });
      });
    });
  });

  describe('.derivedInitializer', () => {
    context('when default attribute is a raw value', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns false', () => {
          expect(Initializer.derivedInitializer.shouldInitialize(attributeDescriptor)).to.be.equal(false);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('throws a TypeError', () => {
          const wrapper = () => Initializer.derivedInitializer.getValue(attributeDescriptor, {});
          expect(wrapper).to.throw('attrDescriptor.default is not a function');
        });
      });
    });

    context('when default attribute is a function', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns true', () => {
          expect(Initializer.derivedInitializer.shouldInitialize(attributeDescriptor)).to.be.equal(true);
        });
      });

      describe('.getValue', () => {
        it('return the value produced by default function', () => {
          attributeDescriptor = { default: () => 'xyz' };
          expect(Initializer.derivedInitializer.getValue(attributeDescriptor, {})).to.be.equal('xyz');
        });

        it('send instance as argument for default function', () => {
          attributeDescriptor = { default: (self) => self };
          instance = '#fake';
          expect(Initializer.derivedInitializer.getValue(attributeDescriptor, instance)).to.be.equal('#fake');
        });
      });
    });
  });
});
