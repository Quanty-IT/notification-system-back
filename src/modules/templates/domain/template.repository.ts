import { TemplateEntity } from './template.entity';

export interface TemplateRepository {
  create(template: TemplateEntity): Promise<void>;
  findAll(): Promise<TemplateEntity[]>;
  findById(id: string): Promise<TemplateEntity | null>;
  findByName(name: string): Promise<TemplateEntity | null>;
  update(template: TemplateEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
