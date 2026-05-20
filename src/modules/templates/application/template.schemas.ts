import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255, 'Name must have at most 255 characters')
    .transform((val) => val.trim().toLowerCase()),

  description: z.string().max(200, 'Description must have at most 200 characters').nullable().optional(),
});

export const updateTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255, 'Name must have at most 255 characters')
    .transform((val) => val.trim().toLowerCase())
    .optional(),

  description: z.string().max(200, 'Description must have at most 200 characters').nullable().optional(),
});

export const activeFilterSchema = z
  .object({
    isActive: z.preprocess((value) => {
      if (value === undefined) return undefined;
      if (value === 'true') return true;
      if (value === 'false') return false;

      return value;
    }, z.boolean().optional()),
  })
  .transform((data) => {
    if (data.isActive === undefined) {
      return {};
    }

    return {
      isActive: data.isActive,
    };
  });

export const templateIdSchema = z.object({
  id: z.uuid('Invalid UUID'),
});

export type CreateTemplateSchemaInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchemaInput = z.infer<typeof updateTemplateSchema>;
export type TemplateIdSchemaInput = z.infer<typeof templateIdSchema>;
