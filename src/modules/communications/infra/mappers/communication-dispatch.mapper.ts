import { CommunicationDispatch as PrismaCommunicationDispatch } from '../../../../../generated/prisma/client';
import { CommunicationDispatchStatus } from '../../domain/communication.constants';
import { EmailProviderName } from '../../domain/email-provider';
import { CommunicationDispatchEntity } from '../../domain/entities/communication-dispatch.entity';

export class CommunicationDispatchMapper {
  static toDomain(dispatch: PrismaCommunicationDispatch): CommunicationDispatchEntity {
    return CommunicationDispatchEntity.fromPersistence({
      id: dispatch.id,
      communicationId: dispatch.communication_id,
      attemptNumber: dispatch.attempt_number,
      provider: dispatch.provider as EmailProviderName,
      status: dispatch.status as CommunicationDispatchStatus,
      startedAt: dispatch.started_at,
      finishedAt: dispatch.finished_at,
    });
  }

  static toPersistence(dispatch: CommunicationDispatchEntity): PrismaCommunicationDispatch {
    return {
      id: dispatch.id,
      communication_id: dispatch.communicationId,
      attempt_number: dispatch.attemptNumber,
      provider: dispatch.provider,
      status: dispatch.status,
      started_at: dispatch.startedAt,
      finished_at: dispatch.finishedAt,
    };
  }
}
