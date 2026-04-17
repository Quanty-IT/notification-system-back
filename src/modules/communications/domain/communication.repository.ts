import { CommunicationEntity } from "./communication.entity";

export interface CommunicationRepository {
  create(communication: CommunicationEntity): Promise<void>;
  findAll(): Promise<CommunicationEntity[]>;
  findById(id: string): Promise<CommunicationEntity | null>;
  update(communication: CommunicationEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
