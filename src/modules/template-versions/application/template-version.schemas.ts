import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const variableTypeSchema = z.enum(['string', 'number', 'boolean']);
export const variablesSchemaJsonSchema = z.record(z.string(), variableTypeSchema).nullable();

export const createTemplateVersionSchema = z.object({
  templateId: z.uuid('Invalid UUID'),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject must have at most 255 characters'),
  body: z.string().min(1, 'Body is required'),
  variablesSchemaJson: variablesSchemaJsonSchema.optional(),
});

export const updateTemplateVersionSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject must have at most 255 characters').optional(),
  body: z.string().min(1, 'Body is required').optional(),
  variablesSchemaJson: variablesSchemaJsonSchema.optional(),
});

export const templateVersionIdSchema = z.object({
  id: z.uuid('Invalid UUID'),
});

export const templateVersionTemplateIdSchema = z.object({
  templateId: z.uuid('Invalid UUID'),
});

export type CreateTemplateVersionSchemaInput = z.infer<typeof createTemplateVersionSchema>;
export type UpdateTemplateVersionSchemaInput = z.infer<typeof updateTemplateVersionSchema>;
export type TemplateVersionIdSchemaInput = z.infer<typeof templateVersionIdSchema>;
export type TemplateVersionTemplateIdSchemaInput = z.infer<typeof templateVersionTemplateIdSchema>;
