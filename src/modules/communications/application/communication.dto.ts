import { z } from 'zod';
import {
  CommunicationChannel,
  CommunicationDispatchStatus,
  CommunicationSourceType,
  CommunicationStatus,
} from '../domain/communication.constants';
import { EmailProviderName } from '../domain/email-provider';
import { TemplateVariableValue } from '../domain/entities';
import { createCommunicationSchema, updateCommunicationSchema } from './communication.schemas';

export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>;
export type UpdateCommunicationInput = z.infer<typeof updateCommunicationSchema>;

export type CommunicationRecipientOutput = {
  id: string;
  communicationId: string;
  recipientType: 'to' | 'cc' | 'bcc';
  email: string;
  createdAt: Date;
};

export type CommunicationAttachmentOutput = {
  id: string;
  communicationId: string;
  originalFileName: string;
  storageProvider: 'r2';
  storageKey: string;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: Date;
};

export type CommunicationDispatchOutput = {
  id: string;
  communicationId: string;
  attemptNumber: number;
  provider: EmailProviderName;
  status: CommunicationDispatchStatus;
  startedAt: Date;
  finishedAt: Date | null;
};

export type CommunicationOutput = {
  id: string;
  channel: CommunicationChannel;
  sourceType: CommunicationSourceType;
  status: CommunicationStatus;
  subject: string | null;
  body: string | null;
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
  recipients: CommunicationRecipientOutput[];
  dispatches: CommunicationDispatchOutput[];
};

export type FindCommunicationsOutput = {
  communications: CommunicationOutput[];
};

export type FindCommunicationAttachmentsOutput = {
  attachments: CommunicationAttachmentOutput[];
};

export type FindCommunicationRecipientsOutput = {
  recipients: CommunicationRecipientOutput[];
};

export type FindCommunicationDispatchesOutput = {
  dispatches: CommunicationDispatchOutput[];
};

export type FindPendingCommunicationsOutput = {
  communications: CommunicationOutput[];
};
