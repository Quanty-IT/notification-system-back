import { ITemplateRepository } from '../domain/template.repository';
import { CreateTemplateDTO, UpdateTemplateDTO } from '../domain/template.dto';
import { Template } from '@prisma/client';

export class TemplateService {
    constructor(private readonly templateRepository: ITemplateRepository) { }

    async create(data: CreateTemplateDTO): Promise<Template> {
        const normalizedName = data.name.toLowerCase().trim();
        if (await this.templateRepository.findByName(normalizedName)) {
            throw new Error('A template with this name already exists.');
        }
        return this.templateRepository.create({ ...data, name: normalizedName });
    }

    async update(id: string, data: UpdateTemplateDTO): Promise<Template> {
        await this.findById(id);

        if (data.name) {
            data.name = data.name.toLowerCase().trim();
        }
        return await this.templateRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.templateRepository.delete(id);
    }

    async activate(id: string): Promise<Template> {
        await this.findById(id);
        return await this.templateRepository.update(id, { is_active: true });
    }

    async deactivate(id: string): Promise<Template> {
        await this.findById(id);
        return await this.templateRepository.update(id, { is_active: false });
    }

    async findById(id: string): Promise<Template> {
        const template = await this.templateRepository.findById(id);
        if (!template) throw new Error('Template not found.');
        return template;
    }

    async listAll(): Promise<Template[]> {
        return this.templateRepository.listAll();
    }
}