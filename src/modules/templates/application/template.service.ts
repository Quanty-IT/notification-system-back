import createHttpError from 'http-errors';

import { TemplateEntity } from '../domain/template.entity';
import { TemplateRepository } from '../domain/template.repository';
import {
  CreateTemplateInput,
  CreateTemplateOutput,
  FindAllTemplatesOutput,
  GetTemplateOutput,
  TemplateOutput,
  UpdateTemplateInput,
  UpdateTemplateOutput,
} from './template.dto';

export class TemplateService {
  constructor(private readonly repository: TemplateRepository) {}

  async create(input: CreateTemplateInput): Promise<CreateTemplateOutput> {
    const templateExists = await this.repository.findByName(input.name);

    if (templateExists) {
      throw new createHttpError.Conflict(`Template with name ${input.name} already exists`);
    }

    const template = TemplateEntity.create(input.name, input.description);

    await this.repository.create(template);

    return this.toOutput(template);
  }

  async findAll(): Promise<FindAllTemplatesOutput> {
    const templates = await this.repository.findAll();

    return {
      templates: templates.map((template) => this.toOutput(template)),
    };
  }

  async findById(id: string): Promise<GetTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    return this.toOutput(template);
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
