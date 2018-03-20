const { expect } = require('chai');
const Initializer = require('../../../src/attributes/initializer');

describe('Initializer', () => {
  let attributeDescriptor, instance;

  describe('.natives', () => {
    context('when default attribute is a raw value', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns true', () => {
          expect(Initializer.natives.shouldInitialize(attributeDescriptor)).to.be.equal(true);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns default value', () => {
          expect(Initializer.natives.getValue(attributeDescriptor, {})).to.be.equal('xyz');
        });
      });
    });

    context('when default attribute is a function', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns false', () => {
          expect(Initializer.natives.shouldInitialize(attributeDescriptor)).to.be.equal(false);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns the same function', () => {
          expect(Initializer.natives.getValue(attributeDescriptor, {})).to.be.a('function');
        });
      });
    });
  });

  describe('.functions', () => {
    context('when default attribute is a raw value', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('returns false', () => {
          expect(Initializer.functions.shouldInitialize(attributeDescriptor)).to.be.equal(false);
        });
      });

      describe('.getValue', () => {
        beforeEach(() => attributeDescriptor = { default: 'xyz' });

        it('throws a TypeError', () => {
          const wrapper = () => Initializer.functions.getValue(attributeDescriptor, {});
          expect(wrapper).to.throw('attr.default is not a function');
        });
      });
    });

    context('when default attribute is a function', () => {
      describe('.shouldInitialize', () => {
        beforeEach(() => attributeDescriptor = { default() {} });

        it('returns true', () => {
          expect(Initializer.functions.shouldInitialize(attributeDescriptor)).to.be.equal(true);
        });
      });

      describe('.getValue', () => {
        it('return the value produced by default function', () => {
          attributeDescriptor = { default: () => 'xyz' };
          expect(Initializer.functions.getValue(attributeDescriptor, {})).to.be.equal('xyz');
        });

        it('send instance as argument for default function', () => {
          attributeDescriptor = { default: (self) => self };
          instance = '#fake';
          expect(Initializer.functions.getValue(attributeDescriptor, instance)).to.be.equal('#fake');
        });
      });
    });
  });
});
