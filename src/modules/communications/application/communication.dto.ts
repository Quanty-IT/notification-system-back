import { z } from 'zod';
import { TemplateVariableValue } from '../domain/communication.entity';
import { createCommunicationSchema, updateCommunicationSchema } from './communication.schemas';

export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>;
export type UpdateCommunicationInput = z.infer<typeof updateCommunicationSchema>;

export type CommunicationAttachmentOutput = {
  id: string;
  communicationId: string;
  originalFileName: string;
  storageProvider: 's3' | 'r2';
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: Date;
};

export type CommunicationOutput = {
  id: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'teams';
  sourceType: 'manual' | 'template';
  status: 'draft' | 'scheduled' | 'processing' | 'sent' | 'failed' | 'canceled';
  subject: string | null;
  body: string | null;
  bodyType: 'text' | 'html' | null;
  templateVersionId: string | null;
  templateVariablesJson: Record<string, TemplateVariableValue> | null;
  scheduledAt: Date | null;
  processingAt: Date | null;
  sentAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCommunicationOutput = Omit<CommunicationOutput, 'createdByUserId' | 'sentAt'> & {
  sentAt?: Date | null;
};

export type UpdateCommunicationOutput = CommunicationOutput;

export type GetCommunicationOutput = CommunicationOutput & {
  attachments: CommunicationAttachmentOutput[];
};

export type FindCommunicationsOutput = {
  communications: CommunicationOutput[];
};

export type FindCommunicationAttachmentsOutput = {
  attachments: CommunicationAttachmentOutput[];
};
