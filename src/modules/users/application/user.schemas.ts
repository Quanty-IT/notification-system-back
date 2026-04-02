import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters').max(255, 'Name must have at most 255 characters'),

  email: z.email('Invalid email').max(255, 'Email must have at most 255 characters'),

  password: z
    .string()
    .min(6, 'Password must have at least 6 characters')
    .max(255, 'Password must have at most 255 characters'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(255, 'Name must have at most 255 characters')
    .optional(),

  email: z.email('Invalid email').max(255, 'Email must have at most 255 characters').optional(),
});

export const userIdSchema = z.object({
  id: z.uuid('Invalid UUID'),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;
export type UserIdSchemaInput = z.infer<typeof userIdSchema>;
