import { PrismaClient, Template } from '@prisma/client';
import { ITemplateRepository } from '../domain/template.repository';
import { CreateTemplateDTO, UpdateTemplateDTO } from '../domain/template.dto';

export class TemplateRepositoryPrisma implements ITemplateRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateTemplateDTO): Promise<Template> {
        return this.prisma.template.create({
            data: { ...data, is_active: true }
        });
    }

    async findByName(name: string): Promise<Template | null> {
        return this.prisma.template.findUnique({ where: { name } });
    }

    async findById(id: string): Promise<Template | null> {
        return this.prisma.template.findUnique({ where: { id } });
    }

    async listAll(): Promise<Template[]> {
        return this.prisma.template.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    async update(id: string, data: UpdateTemplateDTO): Promise<Template> {
        return await this.prisma.template.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Template> {
        return await this.prisma.template.delete({ where: { id } });
    }
}