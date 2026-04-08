import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must have at least 3 characters')
    .max(255, 'Name must have at most 255 characters')
    .transform((val) => val.trim().toLowerCase()),

  description: z.string().max(500, 'Description must have at most 500 characters').nullable().optional(),
});

export const updateTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must have at least 3 characters')
    .max(255, 'Name must have at most 255 characters')
    .transform((val) => val.trim().toLowerCase())
    .optional(),

  description: z.string().max(500, 'Description must have at most 500 characters').nullable().optional(),
});

export const templateIdSchema = z.object({
  id: z.uuid('Invalid UUID'),
});

export type CreateTemplateSchemaInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchemaInput = z.infer<typeof updateTemplateSchema>;
export type TemplateIdSchemaInput = z.infer<typeof templateIdSchema>;
