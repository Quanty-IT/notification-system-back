import { Prisma, TemplateVersion as PrismaTemplateVersion } from '../../../../generated/prisma/client';
import { TemplateVersionEntity, TemplateVersionVariableType } from '../domain/template-version.entity';

export class TemplateVersionMapper {
  static toDomain(templateVersion: PrismaTemplateVersion): TemplateVersionEntity {
    return TemplateVersionEntity.fromPersistence({
      id: templateVersion.id,
      templateId: templateVersion.template_id,
      version: templateVersion.version,
      subject: templateVersion.subject,
      body: templateVersion.body,
      bodyType: templateVersion.body_type as 'text' | 'html',
      variablesSchemaJson:
        (templateVersion.variables_schema_json as Record<string, TemplateVersionVariableType> | null) ?? null,
      isActive: templateVersion.is_active,
      createdAt: templateVersion.created_at,
      updatedAt: templateVersion.updated_at,
    });
  }

  static toPersistence(templateVersion: TemplateVersionEntity) {
    return {
      id: templateVersion.id,
      template_id: templateVersion.templateId,
      version: templateVersion.version,
      subject: templateVersion.subject,
      body: templateVersion.body,
      body_type: templateVersion.bodyType,
      variables_schema_json:
        templateVersion.variablesSchemaJson === null
          ? Prisma.DbNull
          : (templateVersion.variablesSchemaJson as Prisma.InputJsonValue),
      is_active: templateVersion.isActive,
      created_at: templateVersion.createdAt,
      updated_at: templateVersion.updatedAt,
    };
  }
}
