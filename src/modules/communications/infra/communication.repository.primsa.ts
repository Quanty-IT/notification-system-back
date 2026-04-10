import { PrismaClient } from "../../../../generated/prisma/client";
import { CommunicationEntity } from "../domain/communication.entity";
import { CommunicationRepository } from "../domain/communication.repository";
import { CommunicationMapper } from "./communication.mapper";

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
}
