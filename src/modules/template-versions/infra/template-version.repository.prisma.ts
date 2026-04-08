import { PrismaClient } from '../../../../generated/prisma/client';
import { TemplateVersionEntity } from '../domain/template-version.entity';
import { TemplateVersionRepository } from '../domain/template-version.repository';
import { TemplateVersionMapper } from './template-version.mapper';

export class TemplateVersionRepositoryPrisma implements TemplateVersionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(templateVersion: TemplateVersionEntity): Promise<void> {
    await this.prisma.templateVersion.create({
      data: TemplateVersionMapper.toPersistence(templateVersion),
    });
  }

  async findById(id: string): Promise<TemplateVersionEntity | null> {
    const templateVersion = await this.prisma.templateVersion.findUnique({
      where: { id },
    });

    if (!templateVersion) return null;

    return TemplateVersionMapper.toDomain(templateVersion);
  }

  async findAllByTemplateId(templateId: string): Promise<TemplateVersionEntity[]> {
    const templateVersions = await this.prisma.templateVersion.findMany({
      where: { template_id: templateId },
      orderBy: { version: 'desc' },
    });

    return templateVersions.map(TemplateVersionMapper.toDomain);
  }

  async findLatestVersionByTemplateId(templateId: string): Promise<number> {
    const latest = await this.prisma.templateVersion.findFirst({
      where: { template_id: templateId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return latest?.version ?? 0;
  }

  async update(templateVersion: TemplateVersionEntity): Promise<void> {
    await this.prisma.templateVersion.update({
      where: { id: templateVersion.id },
      data: TemplateVersionMapper.toPersistence(templateVersion),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.templateVersion.delete({
      where: { id },
    });
  }
}
