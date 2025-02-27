import { commonEnvSchema } from 'src/config/schema/common.schema';
import { dbEnvSchema } from 'src/config/schema/db.schema';
import { redisEnvSchema } from 'src/config/schema/redis.schema';

export const validationSchema = commonEnvSchema.concat(dbEnvSchema).concat(redisEnvSchema);
