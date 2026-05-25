import { PrismaClient } from '../../../../generated/prisma/client';
import { COMMUNICATION_STATUSES } from '../domain/communication.constants';
import { CommunicationRepository } from '../domain/communication.repository';
import {
  CommunicationAttachmentEntity,
  CommunicationDispatchEntity,
  CommunicationEntity,
  CommunicationRecipientEntity,
} from '../domain/entities';
import {
  CommunicationAttachmentMapper,
  CommunicationDispatchMapper,
  CommunicationMapper,
  CommunicationRecipientMapper,
} from './mappers';

export class CommunicationRepositoryPrisma implements CommunicationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(communication: CommunicationEntity): Promise<void> {
    await this.prisma.communication.create({
      data: CommunicationMapper.toPersistence(communication),
    });
  }

  async findAll(): Promise<CommunicationEntity[]> {
    const communications = await this.prisma.communication.findMany();

    return communications.map(CommunicationMapper.toDomain);
  }

  async findById(id: string): Promise<CommunicationEntity | null> {
    const communication = await this.prisma.communication.findUnique({
      where: { id },
    });

    return communication ? CommunicationMapper.toDomain(communication) : null;
  }

  async update(communication: CommunicationEntity): Promise<void> {
    await this.prisma.communication.update({
      where: { id: communication.id },
      data: CommunicationMapper.toPersistence(communication),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.communication.delete({
      where: { id },
    });
  }

  async createAttachment(attachment: CommunicationAttachmentEntity): Promise<void> {
    await this.prisma.communicationAttachment.create({
      data: CommunicationAttachmentMapper.toPersistence(attachment),
    });
  }

  async findAttachmentsByCommunicationId(communicationId: string): Promise<CommunicationAttachmentEntity[]> {
    const attachments = await this.prisma.communicationAttachment.findMany({
      where: { communication_id: communicationId },
      orderBy: { created_at: 'asc' },
    });

    return attachments.map(CommunicationAttachmentMapper.toDomain);
  }

  async findAttachmentById(attachmentId: string): Promise<CommunicationAttachmentEntity | null> {
    const attachment = await this.prisma.communicationAttachment.findUnique({
      where: { id: attachmentId },
    });

    return attachment ? CommunicationAttachmentMapper.toDomain(attachment) : null;
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    await this.prisma.communicationAttachment.delete({
      where: { id: attachmentId },
    });
  }

  async createRecipient(recipient: CommunicationRecipientEntity): Promise<void> {
    await this.prisma.communicationRecipient.create({
      data: CommunicationRecipientMapper.toPersistence(recipient),
    });
  }

  async findRecipientsByCommunicationId(communicationId: string): Promise<CommunicationRecipientEntity[]> {
    const recipients = await this.prisma.communicationRecipient.findMany({
      where: { communication_id: communicationId },
      orderBy: { created_at: 'asc' },
    });
    return recipients.map(CommunicationRecipientMapper.toDomain);
  }

  async findRecipientById(recipientId: string): Promise<CommunicationRecipientEntity | null> {
    const recipient = await this.prisma.communicationRecipient.findUnique({
      where: { id: recipientId },
    });
    return recipient ? CommunicationRecipientMapper.toDomain(recipient) : null;
  }

  async deleteRecipient(recipientId: string): Promise<void> {
    await this.prisma.communicationRecipient.delete({
      where: { id: recipientId },
    });
  }

  async findRecipientByEmailAndType(
    communicationId: string,
    email: string,
    recipientType: 'to' | 'cc' | 'bcc',
  ): Promise<CommunicationRecipientEntity | null> {
    const recipient = await this.prisma.communicationRecipient.findFirst({
      where: {
        communication_id: communicationId,
        email: email.toLowerCase(),
        recipient_type: recipientType,
      },
    });

    return recipient ? CommunicationRecipientMapper.toDomain(recipient) : null;
  }

  async createDispatch(dispatch: CommunicationDispatchEntity): Promise<void> {
    await this.prisma.communicationDispatch.create({
      data: CommunicationDispatchMapper.toPersistence(dispatch),
    });
  }

  async findDispatchesByCommunicationId(communicationId: string): Promise<CommunicationDispatchEntity[]> {
    const dispatches = await this.prisma.communicationDispatch.findMany({
      where: { communication_id: communicationId },
      orderBy: { started_at: 'asc' },
    });

    return dispatches.map(CommunicationDispatchMapper.toDomain);
  }

  async updateDispatch(dispatch: CommunicationDispatchEntity): Promise<void> {
    await this.prisma.communicationDispatch.update({
      where: { id: dispatch.id },
      data: CommunicationDispatchMapper.toPersistence(dispatch),
    });
  }

  async findPendingCommunications(): Promise<CommunicationEntity[]> {
    const communications = await this.prisma.communication.findMany({
      where: {
        status: COMMUNICATION_STATUSES.SCHEDULED,
        scheduled_at: {
          lte: new Date(),
        },
        processing_at: null,
        sent_at: null,
      },
      orderBy: {
        scheduled_at: 'asc',
      },
    });

    return communications.map(CommunicationMapper.toDomain);
  }

  async findLastDispatchByCommunicationId(communicationId: string): Promise<CommunicationDispatchEntity | null> {
    const dispatch = await this.prisma.communicationDispatch.findFirst({
      where: { communication_id: communicationId },
      orderBy: { started_at: 'desc' },
    });

    return dispatch ? CommunicationDispatchMapper.toDomain(dispatch) : null;
  }
}
