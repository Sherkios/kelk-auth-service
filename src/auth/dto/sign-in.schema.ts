import * as Joi from 'joi';

export const signInSchema = Joi.object({
  login: Joi.string().min(2).required(),
  password: Joi.string().min(3).required(),
});
