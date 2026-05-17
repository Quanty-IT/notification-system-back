import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  COMMUNICATION_CHANNELS,
  COMMUNICATION_SOURCE_TYPES,
  COMMUNICATION_STATUSES,
} from '../domain/communication.constants';

extendZodWithOpenApi(z);

const templateVariableValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const templateVariablesJsonSchema = z.record(z.string(), templateVariableValueSchema).nullable();

export const createRecipientSchema = z.object({
  recipientType: z.enum(['to', 'cc', 'bcc']),
  email: z.email(),
});

export const createCommunicationSchema = z
  .object({
    channel: z.enum(COMMUNICATION_CHANNELS),
    sourceType: z.enum(COMMUNICATION_SOURCE_TYPES),
    status: z.enum(COMMUNICATION_STATUSES).default(COMMUNICATION_STATUSES.PROCESSING),
    subject: z.string().max(255).nullable().optional(),
    body: z.string().nullable().optional(),
    templateVersionId: z.string().nullable().optional(),
    templateVariablesJson: templateVariablesJsonSchema.nullable().optional(),
    scheduledAt: z.coerce.date().nullable().optional(),
    recipients: z.array(createRecipientSchema).min(1, 'At least one recipient is required'),
  })
  .refine(
    (data) => {
      if (data.sourceType === COMMUNICATION_SOURCE_TYPES.TEMPLATE) {
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
      if (data.sourceType === COMMUNICATION_SOURCE_TYPES.TEMPLATE) {
        return data.body === undefined;
      }
      return true;
    },
    {
      message: 'body cannot be provided when sourceType is template',
      path: ['body'],
    },
  )
  .refine(
    (data) => {
      if (data.sourceType === COMMUNICATION_SOURCE_TYPES.MANUAL) {
        return data.templateVersionId === undefined && data.templateVariablesJson === undefined;
      }
      return true;
    },
    {
      message: 'templateVersionId and templateVariablesJson cannot be provided when sourceType is manual',
      path: ['templateVersionId'],
    },
  )
  .refine(
    (data) => {
      const recipients = data.recipients;
      const uniqueRecipients = new Set();

      for (const recipient of recipients) {
        const key = `${recipient.email.toLowerCase()}_${recipient.recipientType}`;
        if (uniqueRecipients.has(key)) {
          return false;
        }
        uniqueRecipients.add(key);
      }

      return true;
    },
    {
      message: 'Duplicate recipients with the same email and recipientType are not allowed',
      path: ['recipients'],
    },
  );

export const updateCommunicationSchema = z.object({
  subject: z.string().max(255, 'Subject must have at most 255 characters').nullable().optional(),
  body: z.string().nullable().optional(),
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

export const communicationRecipientIdSchema = z.object({
  id: z.uuid('Invalid communication UUID'),
  recipientId: z.uuid('Invalid recipient UUID'),
});

export const communicationDispatchIdSchema = z.object({
  id: z.uuid('Invalid communication UUID'),
  dispatchId: z.uuid('Invalid dispatch UUID'),
});

export type CreateCommunicationSchemaInput = z.infer<typeof createCommunicationSchema>;
export type UpdateCommunicationSchemaInput = z.infer<typeof updateCommunicationSchema>;
export type CreateRecipientSchemaInput = z.infer<typeof createRecipientSchema>;
export type CommunicationIdSchemaInput = z.infer<typeof communicationIdSchema>;
export type CommunicationAttachmentIdSchemaInput = z.infer<typeof communicationAttachmentIdSchema>;
export type CommunicationRecipientIdSchemaInput = z.infer<typeof communicationRecipientIdSchema>;
export type CommunicationDispatchIdSchemaInput = z.infer<typeof communicationDispatchIdSchema>;
