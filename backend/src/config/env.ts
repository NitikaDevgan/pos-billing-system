import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({ DATABASE_URL: z.string().url(), PORT: z.coerce.number().int().positive().default(5000), NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), FRONTEND_URL: z.string().url(), JWT_SECRET: z.string().optional() });
export const env = envSchema.parse(process.env);
