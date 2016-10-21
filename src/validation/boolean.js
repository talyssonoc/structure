const joi = require('joi');

module.exports = {
  type: Boolean,
  createJoiSchema(typeDescriptor) {
    var joiSchema = joi.boolean();

    if(typeDescriptor.equal !== undefined) {
      joiSchema = joiSchema.only(typeDescriptor.equal);
    }

    if(typeDescriptor.required) {
      joiSchema = joiSchema.required();
    }

    return joiSchema;
  }
};
