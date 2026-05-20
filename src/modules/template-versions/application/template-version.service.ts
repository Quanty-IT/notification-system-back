import createHttpError from 'http-errors';

import { TemplateRepository } from '@/modules/templates/domain/template.repository';
import { TemplateVersionEntity } from '../domain/template-version.entity';
import { TemplateVersionRepository } from '../domain/template-version.repository';
import {
  CreateTemplateVersionInput,
  CreateTemplateVersionOutput,
  FindTemplateVersionsByTemplateInput,
  FindTemplateVersionsByTemplateOutput,
  GetTemplateVersionOutput,
  UpdateTemplateVersionInput,
  UpdateTemplateVersionOutput,
} from './template-version.dto';

export class TemplateVersionService {
  constructor(
    private readonly repository: TemplateVersionRepository,
    private readonly templateRepository: TemplateRepository,
  ) {}

  async create(input: CreateTemplateVersionInput): Promise<CreateTemplateVersionOutput> {
    const templateExists = await this.templateRepository.findById(input.templateId);

    if (!templateExists) {
      throw new createHttpError.NotFound(`Template ${input.templateId} not found`);
    }

    const latestVersion = await this.repository.findLatestVersionByTemplateId(input.templateId);

    const templateVersion = TemplateVersionEntity.create(
      input.templateId,
      latestVersion + 1,
      input.subject,
      input.body,
      input.variablesSchemaJson,
    );

    await this.repository.create(templateVersion);

    return this.toOutput(templateVersion);
  }

  async findAllByTemplateId(
    templateId: string,
    input?: FindTemplateVersionsByTemplateInput,
  ): Promise<FindTemplateVersionsByTemplateOutput> {
    const templateExists = await this.templateRepository.findById(templateId);

    if (!templateExists) {
      throw new createHttpError.NotFound(`Template ${templateId} not found`);
    }

    const templateVersions = await this.repository.findAllByTemplateId(templateId);
    const filteredTemplateVersions =
      input?.isActive === undefined
        ? templateVersions
        : templateVersions.filter((templateVersion) => templateVersion.isActive === input.isActive);

    return {
      templateVersions: filteredTemplateVersions.map((templateVersion) => this.toOutput(templateVersion)),
    };
  }

  async findById(id: string): Promise<GetTemplateVersionOutput> {
    const templateVersion = await this.repository.findById(id);

    if (!templateVersion) {
      throw new createHttpError.NotFound(`Template version ${id} not found`);
    }

    return this.toOutput(templateVersion);
  }

  async update(id: string, input: UpdateTemplateVersionInput): Promise<UpdateTemplateVersionOutput> {
    const templateVersion = await this.repository.findById(id);

    if (!templateVersion) {
      throw new createHttpError.NotFound(`Template version ${id} not found`);
    }

    if (input.subject !== undefined) {
      templateVersion.updateSubject(input.subject);
    }

    if (input.body !== undefined) {
      templateVersion.updateBody(input.body);
    }

    if (input.variablesSchemaJson !== undefined) {
      templateVersion.updateVariablesSchemaJson(input.variablesSchemaJson);
    }

    await this.repository.update(templateVersion);

    return this.toOutput(templateVersion);
  }

  async activate(id: string): Promise<UpdateTemplateVersionOutput> {
    const templateVersion = await this.repository.findById(id);

    if (!templateVersion) {
      throw new createHttpError.NotFound(`Template version ${id} not found`);
    }

    templateVersion.activate();

    await this.repository.update(templateVersion);

    return this.toOutput(templateVersion);
  }

  async deactivate(id: string): Promise<UpdateTemplateVersionOutput> {
    const templateVersion = await this.repository.findById(id);

    if (!templateVersion) {
      throw new createHttpError.NotFound(`Template version ${id} not found`);
    }

    templateVersion.deactivate();

    await this.repository.update(templateVersion);

    return this.toOutput(templateVersion);
  }

  async delete(id: string): Promise<void> {
    const templateVersion = await this.repository.findById(id);

    if (!templateVersion) {
      throw new createHttpError.NotFound(`Template version ${id} not found`);
    }

    await this.repository.delete(id);
  }

  private toOutput(templateVersion: TemplateVersionEntity): GetTemplateVersionOutput {
    return {
      id: templateVersion.id,
      templateId: templateVersion.templateId,
      version: templateVersion.version,
      subject: templateVersion.subject,
      body: templateVersion.body,
      variablesSchemaJson: templateVersion.variablesSchemaJson,
      isActive: templateVersion.isActive,
      createdAt: templateVersion.createdAt,
      updatedAt: templateVersion.updatedAt,
    };
  }
}
