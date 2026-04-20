import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const templateVariableValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const templateVariablesJsonSchema = z.record(z.string(), templateVariableValueSchema).nullable();

export const createCommunicationSchema = z
  .object({
    channel: z.enum(['email']),
    sourceType: z.enum(['manual', 'template']),
    status: z.enum(['draft', 'scheduled', 'processing', 'sent', 'failed', 'canceled']).default('draft'),
    subject: z.string().max(255).nullable().optional(),
    body: z.string().nullable().optional(),
    bodyType: z.enum(['text', 'html']).nullable().optional(),
    templateVersionId: z.string().nullable().optional(),
    templateVariablesJson: templateVariablesJsonSchema.nullable().optional(),
    scheduledAt: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.sourceType === 'template') {
        return data.templateVersionId !== null && data.templateVersionId !== undefined;
      }
      return true;
    },
    {
      message: 'templateVersionId is required when sourceType is template',
      path: ['templateVersionId'],
    },
  )
  .refine(
    (data) => {
      if (data.sourceType === 'template') {
        return data.body === undefined && data.bodyType === undefined;
      }
      return true;
    },
    {
      message: 'body and bodyType cannot be provided when sourceType is template',
      path: ['body'],
    },
  )
  .refine(
    (data) => {
      if (data.sourceType === 'manual') {
        return data.templateVersionId === undefined && data.templateVariablesJson === undefined;
      }
      return true;
    },
    {
      message: 'templateVersionId and templateVariablesJson cannot be provided when sourceType is manual',
      path: ['templateVersionId'],
    },
  );

export const updateCommunicationSchema = z.object({
  subject: z.string().max(255, 'Subject must have at most 255 characters').nullable().optional(),
  body: z.string().nullable().optional(),
  bodyType: z.enum(['text', 'html']).nullable().optional(),
  templateVersionId: z.string().nullable().optional(),
  templateVariablesJson: templateVariablesJsonSchema.optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
});

export const communicationIdSchema = z.object({
  id: z.uuid('Invalid UUID'),
});

export const communicationAttachmentIdSchema = z.object({
  id: z.uuid('Invalid communication UUID'),
  attachmentId: z.uuid('Invalid attachment UUID'),
});

export type CreateCommunicationSchemaInput = z.infer<typeof createCommunicationSchema>;
export type UpdateCommunicationSchemaInput = z.infer<typeof updateCommunicationSchema>;
export type CommunicationIdSchemaInput = z.infer<typeof communicationIdSchema>;
export type CommunicationAttachmentIdSchemaInput = z.infer<typeof communicationAttachmentIdSchema>;
