exports.classAsSecondParam = (ErroneousPassedClass) =>
  new Error(
    `You passed the structure class as the second parameter of attributes(). The expected usage is \`attributes(schema)(${ErroneousPassedClass.name ||
      'StructureClass'})\`.`
  );

exports.nonObjectAttributes = () =>
  new TypeError("#attributes can't be set to a non-object.");

exports.arrayOrIterable = () =>
  new TypeError('Value must be iterable or array-like.');

exports.missingDynamicType = (attributeName) =>
  new Error(`Missing dynamic type for attribute: ${attributeName}.`);

exports.invalidType = (attributeName) =>
  new TypeError(
    `Attribute type must be a constructor or the name of a dynamic type: ${attributeName}.`
  );

exports.invalidAttributes = (errors, StructureValidationError) =>
  new StructureValidationError(errors);
