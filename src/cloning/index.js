exports.buildCloneDescriptorFor = function buildCloneDescriptorFor(StructureClass) {
  return {
    configurable: true,
    value: function clone(overwrites = {}, options = {}) {
      const { strict } = options;

      const newAttributes = {
        ...this.attributes,
        ...overwrites,
      };

      let cloneInstance;

      if (strict) {
        cloneInstance = StructureClass.buildStrict(newAttributes);
      } else {
        cloneInstance = new StructureClass(newAttributes);
      }

      return cloneInstance;
    },
  };
};
