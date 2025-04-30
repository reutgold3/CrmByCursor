const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('admin', 'user').default('user')
});

const clientSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),
  phone: Joi.string().pattern(/^[0-9+\-() ]{10,20}$/),
  company: Joi.string().max(100),
  address: Joi.string().max(500)
});

const projectSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().required().max(1000),
  client_id: Joi.number().required().integer().positive(),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending'),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')),
  budget: Joi.number().precision(2).min(0)
});

const invoiceSchema = Joi.object({
  project_id: Joi.number().integer().positive(),
  client_id: Joi.number().required().integer().positive(),
  amount: Joi.number().required().precision(2).min(0),
  status: Joi.string().valid('draft', 'sent', 'paid', 'cancelled').default('draft'),
  due_date: Joi.date().iso().required(),
  notes: Joi.string().max(1000)
});

module.exports = {
  userSchema,
  clientSchema,
  projectSchema,
  invoiceSchema
}; 