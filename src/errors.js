function invalidAttributes(errors){
  let error = new Error('Invalid Attributes');
  error.details = errors;
  return error;
}

module.exports = {
  classAsSecondParam: (ErroneousPassedClass) => new Error(`You passed the structure class as the second parameter of attributes(). The expected usage is \`attributes(schema)(${ ErroneousPassedClass.name || 'StructureClass' })\`.`),
  nonObjectAttributes: () => new TypeError('#attributes can\'t be set to a non-object.'),
  arrayOrIterable: () => new TypeError('Value must be iterable or array-like.'),
  missingDynamicType: (attributeName) => new Error(`Missing dynamic type for attribute: ${ attributeName }.`),
  invalidType: (attributeName) => new TypeError(`Attribute type must be a constructor or the name of a dynamic type: ${ attributeName }.`),
  invalidAttributes
};
