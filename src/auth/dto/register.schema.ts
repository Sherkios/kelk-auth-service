import * as Joi from 'joi';

export const registerSchema = Joi.object({
  login: Joi.string().min(2).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});
