import { CommunicationRecipient as PrismaCommunicationRecipient } from '../../../../../generated/prisma/client';
import { CommunicationRecipientEntity } from '../../domain/communication-recipient.entity';

export class CommunicationRecipientMapper {
  static toDomain(recipient: PrismaCommunicationRecipient): CommunicationRecipientEntity {
    return CommunicationRecipientEntity.fromPersistence({
      id: recipient.id,
      communicationId: recipient.communication_id,
      recipientType: recipient.recipient_type as 'to' | 'cc' | 'bcc',
      email: recipient.email,
      createdAt: recipient.created_at,
    });
  }

  static toPersistence(recipient: CommunicationRecipientEntity) {
    return {
      id: recipient.id,
      communication_id: recipient.communicationId,
      recipient_type: recipient.recipientType,
      email: recipient.email,
      created_at: recipient.createdAt,
    };
  }
}
