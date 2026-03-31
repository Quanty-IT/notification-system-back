import createHttpError from 'http-errors';
import { TemplateEntity } from '../domain/template.entity';
import { TemplateRepository } from '../domain/template.repository';
import {
  CreateTemplateInput,
  CreateTemplateOutput,
  FindAllTemplatesOutput,
  GetTemplateOutput,
  UpdateTemplateInput,
  UpdateTemplateOutput,
} from './template.dto';

export class TemplateService {
  constructor(private readonly repository: TemplateRepository) {}

  async create(input: CreateTemplateInput): Promise<CreateTemplateOutput> {
    const normalizedName = input.name.toLowerCase();

    const templateExists = await this.repository.findByName(normalizedName);

    if (templateExists) {
      throw new createHttpError.Conflict(`Template with name ${input.name} already exists`);
    }

    const template = TemplateEntity.create(normalizedName, input?.description);

    await this.repository.create(template);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  async findAll(): Promise<FindAllTemplatesOutput> {
    const templates = await this.repository.findAll();

    return {
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        isActive: template.isActive,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      })),
    };
  }

  async findById(id: string): Promise<GetTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  async update(id: string, input: UpdateTemplateInput): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    if (input.name && input.name.toLowerCase() !== template.name) {
      const normalizedName = input.name.toLowerCase();

      const templateWithSameName = await this.repository.findByName(normalizedName);

      if (templateWithSameName) {
        throw new createHttpError.Conflict(`Template with name ${input.name} already exists`);
      }

      template.updateName(normalizedName);
    }

    if (input.description !== undefined) {
      template.updateDescription(input.description);
    }

    await this.repository.update(template);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  async activate(id: string): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    template.activate();

    await this.repository.update(template);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  async deactivate(id: string): Promise<UpdateTemplateOutput> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    template.deactivate();

    await this.repository.update(template);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const template = await this.repository.findById(id);

    if (!template) {
      throw new createHttpError.NotFound(`Template ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
