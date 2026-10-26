import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  FRONTEND_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  JWT_EXPIRES_IN: z.string().default('8h'),
  ADMIN_NAME: z.string().default('Admin'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters').optional(),
});
const parsed = envSchema.parse(process.env);
const isProduction = parsed.NODE_ENV === 'production';
if (isProduction && !parsed.JWT_SECRET) throw new Error('JWT_SECRET is required in production.');

// Development-only fallbacks so the app runs out of the box. Never relied on in production.
export const env = {
  ...parsed,
  JWT_SECRET: parsed.JWT_SECRET ?? 'dev-only-insecure-jwt-secret-change-me-please',
  ADMIN_EMAIL: (parsed.ADMIN_EMAIL ?? (isProduction ? undefined : 'admin@cafe.local'))?.toLowerCase(),
  ADMIN_PASSWORD: parsed.ADMIN_PASSWORD ?? (isProduction ? undefined : 'admin123'),
};
