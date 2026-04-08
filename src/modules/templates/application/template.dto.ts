import { z } from 'zod';
import { createTemplateSchema, updateTemplateSchema } from './template.schemas';

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

export type TemplateOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTemplateOutput = TemplateOutput;
export type UpdateTemplateOutput = TemplateOutput;
export type GetTemplateOutput = TemplateOutput;

export type FindAllTemplatesOutput = {
  templates: TemplateOutput[];
};
