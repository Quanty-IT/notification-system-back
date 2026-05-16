import { CommunicationDispatch as PrismaCommunicationDispatch } from '../../../../../generated/prisma/client';
import { CommunicationDispatchEntity } from '../../domain/communication-dispatch.entity';

export class CommunicationDispatchMapper {
  static toDomain(dispatch: PrismaCommunicationDispatch): CommunicationDispatchEntity {
    return CommunicationDispatchEntity.fromPersistence({
      id: dispatch.id,
      communicationId: dispatch.communication_id,
      attemptNumber: dispatch.attempt_number,
      provider: dispatch.provider as 'smtp' | 'nodemailer' | 'twilio',
      status: dispatch.status as 'processing' | 'sent' | 'failed',
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
