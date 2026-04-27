import { CommunicationEntity } from './communication.entity';
import { CommunicationAttachmentEntity } from './communication-attachment.entity';
import { CommunicationRecipientEntity } from './communication-recipient.entity';

export interface CommunicationRepository {
  create(communication: CommunicationEntity): Promise<void>;
  findAll(): Promise<CommunicationEntity[]>;
  findById(id: string): Promise<CommunicationEntity | null>;
  update(communication: CommunicationEntity): Promise<void>;
  delete(id: string): Promise<void>;

  createAttachment(attachment: CommunicationAttachmentEntity): Promise<void>;
  findAttachmentsByCommunicationId(communicationId: string): Promise<CommunicationAttachmentEntity[]>;
  findAttachmentById(attachmentId: string): Promise<CommunicationAttachmentEntity | null>;
  deleteAttachment(attachmentId: string): Promise<void>;

  createRecipient(recipient: CommunicationRecipientEntity): Promise<void>;
  findRecipientsByCommunicationId(communicationId: string): Promise<CommunicationRecipientEntity[]>;
  findRecipientById(recipientId: string): Promise<CommunicationRecipientEntity | null>;
  findRecipientByEmailAndType(communicationId: string, email: string, recipientType: 'to' | 'cc' | 'bcc'): Promise<CommunicationRecipientEntity | null>;
  deleteRecipient(recipientId: string): Promise<void>;
}
