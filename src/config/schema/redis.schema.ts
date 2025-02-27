import * as Joi from 'joi';

export const redisEnvSchema = Joi.object({
  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().required(),
});
