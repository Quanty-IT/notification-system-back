import { TemplateVersionEntity } from './template-version.entity';

export interface TemplateVersionRepository {
  create(templateVersion: TemplateVersionEntity): Promise<void>;
  findById(id: string): Promise<TemplateVersionEntity | null>;
  findAllByTemplateId(templateId: string): Promise<TemplateVersionEntity[]>;
  findLatestVersionByTemplateId(templateId: string): Promise<number>;
  templateExists(templateId: string): Promise<boolean>;
  update(templateVersion: TemplateVersionEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
