import { PrismaClient } from '../../../../generated/prisma/client';
import { TemplateEntity } from '../domain/template.entity';
import { TemplateRepository } from '../domain/template.repository';
import { TemplateMapper } from './template.mapper';

export class TemplateRepositoryPrisma implements TemplateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(template: TemplateEntity): Promise<void> {
    await this.prisma.template.create({
      data: TemplateMapper.toPersistence(template),
    });
  }

  async findAll(): Promise<TemplateEntity[]> {
    const templates = await this.prisma.template.findMany();

    return templates.map(TemplateMapper.toDomain);
  }

  async findById(id: string): Promise<TemplateEntity | null> {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) return null;

    return TemplateMapper.toDomain(template);
  }

  async findByName(name: string): Promise<TemplateEntity | null> {
    const template = await this.prisma.template.findUnique({
      where: { name },
    });

    if (!template) return null;

    return TemplateMapper.toDomain(template);
  }

  async update(template: TemplateEntity): Promise<void> {
    await this.prisma.template.update({
      where: { id: template.id },
      data: TemplateMapper.toPersistence(template),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.template.delete({
      where: { id },
    });
  }
}
