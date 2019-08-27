class ValidationError extends Error {
  constructor(errors) {
    super('Invalid Attributes');
    this.details = errors;
  }
}

module.exports = ValidationError;
