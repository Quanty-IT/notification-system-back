import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createTemplateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome deve ter no máximo 255 caracteres'),

  description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').nullable().optional(),
});

export const updateTemplateSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional(),

  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').nullable().optional(),
});

export const templateIdSchema = z.object({
  id: z.uuid('Uuid inválido'),
});

export type CreateTemplateSchemaInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchemaInput = z.infer<typeof updateTemplateSchema>;
export type TemplateIdSchemaInput = z.infer<typeof templateIdSchema>;
