import { Template as PrismaTemplate } from '../../../../generated/prisma/client';
import { TemplateEntity } from '../domain/template.entity';

export class TemplateMapper {
  static toDomain(template: PrismaTemplate): TemplateEntity {
    return TemplateEntity.fromPersistence({
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.is_active,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    });
  }

  static toPersistence(template: TemplateEntity) {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      is_active: template.isActive,
      created_at: template.createdAt,
      updated_at: template.updatedAt,
    };
  }
}
