import { PrismaClient, Template } from '@prisma/client';
import {
    ITemplateRepository,
    CreateTemplateDTO,
    UpdateTemplateDTO,
} from '../domain/template.repository';


const prisma = new PrismaClient();

export class TemplateRepositoryPrisma implements ITemplateRepository {
    async create(data: CreateTemplateDTO): Promise<Template> {
        return prisma.template.create({
            data: {
                name: data.name,
                description: data.description,
                is_active: true
            }
        });
    }

    async findByName(name: string): Promise<Template | null> {
        return prisma.template.findUnique({ where: { name } });
    }

    async findById(id: string): Promise<Template | null> {
        return prisma.template.findUnique({ where: { id } });
    }

    async listAll(): Promise<Template[]> {
        return prisma.template.findMany({
            where: { is_active: true },
            orderBy: { created_at: 'desc' }
        });
    }

    async update(id: string, data: UpdateTemplateDTO): Promise<Template | null> {
        try {
            return await prisma.template.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    is_active: data.is_active,
                },
            });
        } catch (error) {
            return null;
        }
    }

    async delete(id: string): Promise<Template | null> {

        return this.update(id, { is_active: false }); // Soft delete
    }
}