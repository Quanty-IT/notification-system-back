import { TemplateVariableValue } from 'resend';
import { z } from 'zod';
import { createTemplateVersionSchema, updateTemplateVersionSchema } from './template-version.schemas';

export type CreateTemplateVersionInput = z.infer<typeof createTemplateVersionSchema>;
export type UpdateTemplateVersionInput = z.infer<typeof updateTemplateVersionSchema>;

export type TemplateVersionOutput = {
  id: string;
  templateId: string;
  version: number;
  subject: string;
  body: string;
  variablesSchemaJson: Record<string, TemplateVariableValue> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTemplateVersionOutput = TemplateVersionOutput;
export type UpdateTemplateVersionOutput = TemplateVersionOutput;
export type GetTemplateVersionOutput = TemplateVersionOutput;

export type FindTemplateVersionsByTemplateOutput = {
  templateVersions: TemplateVersionOutput[];
};
