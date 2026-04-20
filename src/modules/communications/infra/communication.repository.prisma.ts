import { PrismaClient } from '../../../../generated/prisma/client';
import { CommunicationEntity } from '../domain/communication.entity';
import { CommunicationRepository } from '../domain/communication.repository';
import { CommunicationAttachmentEntity } from '../domain/communication-attachment.entity';
import { CommunicationMapper } from './communication.mapper';
import { CommunicationAttachmentMapper } from './communication-attachment.mapper';

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
}
