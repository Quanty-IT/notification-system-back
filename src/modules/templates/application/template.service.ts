import createHttpError from 'http-errors';
import { FindTemplateVersionsByTemplateOutput } from '@/modules/template-versions/application/template-version.dto';
import { TemplateVersionRepository } from '@/modules/template-versions/domain/template-version.repository';
import { TemplateEntity } from '../domain/template.entity';
import { TemplateRepository } from '../domain/template.repository';
import {
  CreateTemplateInput,
  CreateTemplateOutput,
  FindAllTemplatesInput,
  FindAllTemplatesOutput,
  GetTemplateOutput,
  TemplateOutput,
  UpdateTemplateInput,
  UpdateTemplateOutput,
} from './template.dto';

export class TemplateService {
  constructor(
    private readonly repository: TemplateRepository,
    private readonly templateVersionRepository: TemplateVersionRepository,
  ) {}

  async create(input: CreateTemplateInput): Promise<CreateTemplateOutput> {
    const templateExists = await this.repository.findByName(input.name);

    if (templateExists) {
      throw new createHttpError.Conflict(`Template with name ${input.name} already exists`);
    }

    const template = TemplateEntity.create(input.name, input.description);

    await this.repository.create(template);

    return this.toOutput(template);
  }

  async findAll(input?: FindAllTemplatesInput): Promise<FindAllTemplatesOutput> {
    const templates = await this.repository.findAll();

    const filteredTemplates =
      input?.isActive === undefined ? templates : templates.filter((template) => template.isActive === input.isActive);

    const templatesOrderedByStatusAndCreationDate = filteredTemplates.sort((currentTemplate, nextTemplate) => {
      if (currentTemplate.isActive !== nextTemplate.isActive) {
        return currentTemplate.isActive ? -1 : 1;
      }

      return nextTemplate.createdAt.getTime() - currentTemplate.createdAt.getTime();
    });

    return {
      templates: templatesOrderedByStatusAndCreationDate.map((template) => this.toOutput(template)),
    };
  }

  async findById(id: string): Promise<GetTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    return this.toOutput(template);
  }

  async findVersionsByTemplateId(
    templateId: string,
    input?: { isActive?: boolean },
  ): Promise<FindTemplateVersionsByTemplateOutput> {
    const template = await this.repository.findById(templateId);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${templateId} not found`);
    }

    const versions = await this.templateVersionRepository.findAllByTemplateId(templateId);
    const filteredVersions =
      input?.isActive === undefined ? versions : versions.filter((version) => version.isActive === input.isActive);

    return {
      templateVersions: filteredVersions.map((version) => ({
        id: version.id,
        templateId: version.templateId,
        version: version.version,
        subject: version.subject,
        body: version.body,
        variablesSchemaJson: version.variablesSchemaJson,
        isActive: version.isActive,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
      })),
    };
  }

  async update(id: string, input: UpdateTemplateInput): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    if (input.name && input.name !== template.name) {
      const templateWithSameName = await this.repository.findByName(input.name);

      if (templateWithSameName) {
        throw new createHttpError.Conflict(`Template with name ${input.name} already exists`);
      }

      template.updateName(input.name);
    }

    if (input.description !== undefined) {
      template.updateDescription(input.description);
    }

    await this.repository.update(template);

    return this.toOutput(template);
  }

  async activate(id: string): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    template.activate();

    await this.repository.update(template);

    return this.toOutput(template);
  }

  async deactivate(id: string): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    template.deactivate();

    await this.repository.update(template);

    return this.toOutput(template);
  }

  async delete(id: string): Promise<void> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    await this.repository.delete(id);
  }

  private toOutput(template: TemplateEntity): TemplateOutput {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
