import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome deve ter no máximo 255 caracteres'),

  email: z.email('E-mail inválido').max(255, 'E-mail deve ter no máximo 255 caracteres'),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional(),

  email: z.email('E-mail inválido').max(255, 'E-mail deve ter no máximo 255 caracteres').optional(),
});

export const userIdSchema = z.object({
  id: z.uuid('Uuid inválido'),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;
export type UserIdSchemaInput = z.infer<typeof userIdSchema>;
