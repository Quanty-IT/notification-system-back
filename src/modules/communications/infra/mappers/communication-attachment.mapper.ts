import { CommunicationAttachment as PrismaCommunicationAttachment } from '../../../../../generated/prisma/client';
import { CommunicationAttachmentEntity } from '../../domain/communication-attachment.entity';

export class CommunicationAttachmentMapper {
  static toDomain(attachment: PrismaCommunicationAttachment): CommunicationAttachmentEntity {
    return CommunicationAttachmentEntity.fromPersistence({
      id: attachment.id,
      communicationId: attachment.communication_id,
      originalFileName: attachment.original_file_name,
      storageProvider: attachment.storage_provider as 'r2',
      storageKey: attachment.storage_key,
      mimeType: attachment.mime_type,
      fileSizeBytes: Number(attachment.file_size_bytes),
      createdAt: attachment.created_at,
    });
  }

  static toPersistence(attachment: CommunicationAttachmentEntity) {
    return {
      id: attachment.id,
      communication_id: attachment.communicationId,
      original_file_name: attachment.originalFileName,
      storage_provider: attachment.storageProvider,
      storage_key: attachment.storageKey,
      mime_type: attachment.mimeType,
      file_size_bytes: attachment.fileSizeBytes,
      created_at: attachment.createdAt,
    };
  }
}
