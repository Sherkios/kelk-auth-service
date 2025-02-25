import * as Joi from 'joi';

export const commonEnvSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  APP_PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().required(),
});
