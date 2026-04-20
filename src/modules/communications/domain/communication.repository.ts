import { CommunicationEntity } from './communication.entity';
import { CommunicationAttachmentEntity } from './communication-attachment.entity';

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
}
