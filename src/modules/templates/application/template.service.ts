import {
    ITemplateRepository,
    CreateTemplateDTO,
    UpdateTemplateDTO,
} from '../domain/template.repository';
import { Template } from '@prisma/client';

export class TemplateService {
    constructor(private readonly templateRepository: ITemplateRepository) { }

    async create(data: CreateTemplateDTO): Promise<Template> {
        const normalizedName = data.name.toLowerCase().trim();

        const existingTemplate = await this.templateRepository.findByName(normalizedName);

        if (existingTemplate) {
            throw new Error('A template with this name already exists (case-insensitive).');
        }

        return this.templateRepository.create({ ...data, name: normalizedName });
    }

    async listAll(): Promise<Template[]> {
        return this.templateRepository.listAll();
    }

    async findById(id: string): Promise<Template> {
        const template = await this.templateRepository.findById(id);
        if (!template) throw new Error('Template not found.');
        return template;
    }

    async update(id: string, data: UpdateTemplateDTO): Promise<Template> {
        const templateExists = await this.templateRepository.findById(id);
        if (!templateExists) throw new Error('Template not found.');

        if (data.name) {
            const normalizedNewName = data.name.toLowerCase().trim();
            if (normalizedNewName !== templateExists.name.toLowerCase()) {
                const nameInUse = await this.templateRepository.findByName(normalizedNewName);
                if (nameInUse && nameInUse.id !== id) {
                    throw new Error('A template with this name already exists (case-insensitive).');
                }
            }
        }

        const updatedTemplate = await this.templateRepository.update(id, data);
        if (!updatedTemplate) throw new Error('Failed to update template.');
        return updatedTemplate;
    }

    async delete(id: string): Promise<Template> {
        const templateExists = await this.templateRepository.findById(id);
        if (!templateExists) throw new Error('Template not found.');

        const deletedTemplate = await this.templateRepository.delete(id);
        if (!deletedTemplate) throw new Error('Failed to delete template.');
        return deletedTemplate;
    }
}