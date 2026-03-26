import { z } from 'zod';

const envSchema = z.object({
  // Environment
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),

  // JWT
  JWT_SECRET_KEY: z.string().min(1, 'JWT_SECRET_KEY é obrigatório'),
  JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN é obrigatório'),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  const tree = z.treeifyError(result.error);
  console.error('❌ Invalid environment variables:', tree);
  throw new Error('Invalid environment variables');
}

export const env = result.data;
