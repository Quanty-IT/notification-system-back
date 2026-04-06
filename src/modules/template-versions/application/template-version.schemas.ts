import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const jsonRecordSchema = z.record(z.string(), z.unknown());

export const createTemplateVersionSchema = z.object({
  templateId: z.uuid('Invalid UUID'),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject must have at most 255 characters'),
  body: z.string().min(1, 'Body is required'),
  bodyType: z.string().min(1, 'Body type is required').max(20, 'Body type must have at most 20 characters'),
  variablesSchemaJson: jsonRecordSchema.nullable().optional(),
});

export const updateTemplateVersionSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject must have at most 255 characters').optional(),
  body: z.string().min(1, 'Body is required').optional(),
  bodyType: z.string().min(1, 'Body type is required').max(20, 'Body type must have at most 20 characters').optional(),
  variablesSchemaJson: jsonRecordSchema.nullable().optional(),
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
