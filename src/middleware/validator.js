const { userSchema, clientSchema, projectSchema, invoiceSchema } = require('../validators/schemas');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return res.status(400).json({ errors });
    }
    next();
  };
};

module.exports = {
  validateUser: validate(userSchema),
  validateClient: validate(clientSchema),
  validateProject: validate(projectSchema),
  validateInvoice: validate(invoiceSchema)
}; 