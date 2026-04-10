import { z } from 'zod';
import { createCommunicationSchema, updateCommunicationSchema } from './communication.schemas';
import { TemplateVariableValue } from '../domain/communication.entity';

export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>;
export type UpdateCommunicationInput = z.infer<typeof updateCommunicationSchema>;

export type CommunicationOutput = {
    id: string;
    channel: "email" | "whatsapp" | "sms" | "teams";
    sourceType: "manual" | "template";
    status: "draft" | "scheduled" | "queued" | "processing" | "sent" | "failed" | "canceled";
    subject: string | null;
    body: string | null;
    bodyType: "text" | "html" | null;
    templateVersionId: string | null;
    templateVariablesJson: Record<string, TemplateVariableValue> | null;
    scheduledAt: Date | null;
    queuedAt: Date | null;
    processingAt: Date | null;
    sentAt: Date | null;
    createdByUserId: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateCommunicationOutput = CommunicationOutput;
export type UpdateCommunicationOutput = CommunicationOutput;
export type GetCommunicationOutput = CommunicationOutput;
export type FindCommunicationsOutput = {
    communications: CommunicationOutput[];
};
