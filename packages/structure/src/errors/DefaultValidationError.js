class DefautValidationError extends Error {
  constructor(errors) {
    super('Invalid Attributes');
    this.details = errors;
  }
}

module.exports = DefautValidationError;
