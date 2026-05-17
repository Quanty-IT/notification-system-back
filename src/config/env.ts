import { z } from 'zod';

export enum Environment {
  DEV = 'development',
  PRD = 'production',
}

const environments = Object.values(Environment) as [string, ...string[]];
const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(environments).default(Environment.DEV),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // API Key
  API_KEY: z.string().min(1, 'API_KEY is required'),

  // JWT
  JWT_SECRET_KEY: z.string().min(1, 'JWT_SECRET_KEY is required'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_TOKEN_EXPIRES_IN is required'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_TOKEN_EXPIRES_IN is required'),

  // Cloudflare
  CLOUDFLARE_ENDPOINT: z.string().min(1, 'CLOUDFLARE_ENDPOINT is required'),
  CLOUDFLARE_PUBLIC_URL: z.string().min(1, 'CLOUDFLARE_PUBLIC_URL is required'),
  CLOUDFLARE_BUCKET_NAME: z.string().min(1, 'CLOUDFLARE_BUCKET_NAME is required'),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1, 'CLOUDFLARE_ACCESS_KEY_ID is required'),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1, 'CLOUDFLARE_SECRET_ACCESS_KEY is required'),

  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().min(1, 'RESEND_FROM_EMAIL is required'),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  const tree = z.treeifyError(result.error);
  console.error('❌ Invalid environment variables:', tree);
  throw new Error('Invalid environment variables');
}

export const env = result.data;
