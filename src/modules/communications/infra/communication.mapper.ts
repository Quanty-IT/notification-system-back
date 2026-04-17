import { Prisma, Communication as PrismaCommunication } from '../../../../generated/prisma/client';

import { CommunicationEntity, TemplateVariableValue } from '../domain/communication.entity';

export class CommunicationMapper {
  static toDomain(communication: PrismaCommunication): CommunicationEntity {
    return CommunicationEntity.fromPersistence({
      id: communication.id,

      channel: communication.channel as 'email' | 'whatsapp' | 'sms' | 'teams',
      sourceType: communication.source_type as 'manual' | 'template',
      status: communication.status as 'draft' | 'scheduled' | 'processing' | 'sent' | 'failed' | 'canceled',
      subject: communication.subject,
      body: communication.body,
      bodyType: communication.body_type as 'text' | 'html',
      templateVersionId: communication.template_version_id,
      templateVariablesJson:
        (communication.template_variables_json as Record<string, TemplateVariableValue> | null) ?? null,
      scheduledAt: communication.scheduled_at,
      processingAt: communication.processing_at,
      sentAt: communication.sent_at,
      createdByUserId: communication.created_by_user_id,
      createdAt: communication.created_at,
      updatedAt: communication.updated_at,
    });
  }

  static toPersistence(communication: CommunicationEntity) {
    return {
      id: communication.id,
      channel: communication.channel,
      source_type: communication.sourceType,
      status: communication.status,
      subject: communication.subject,
      body: communication.body,
      body_type: communication.bodyType,
      template_version_id: communication.templateVersionId,
      template_variables_json:
        communication.templateVariablesJson === null
          ? Prisma.DbNull
          : (communication.templateVariablesJson as Prisma.InputJsonValue),

      scheduled_at: communication.scheduledAt,
      processing_at: communication.processingAt,
      sent_at: communication.sentAt,
      created_by_user_id: communication.createdByUserId,
      created_at: communication.createdAt,
      updated_at: communication.updatedAt,
    };
  }
}
