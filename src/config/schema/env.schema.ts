import { commonEnvSchema } from 'src/config/schema/common.schema';
import { dbEnvSchema } from 'src/config/schema/db.schema';

export const validationSchema = commonEnvSchema.concat(dbEnvSchema);
