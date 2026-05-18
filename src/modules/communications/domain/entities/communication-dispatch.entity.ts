import { COMMUNICATION_DISPATCH_STATUSES, CommunicationDispatchStatus } from '../communication.constants';
import { EMAIL_PROVIDERS, EmailProviderName } from '../email-provider';

export type CommunicationDispatchesProps = {
  id: string;
  communicationId: string;
  attemptNumber: number;
  provider: EmailProviderName;
  status: CommunicationDispatchStatus;
  startedAt: Date;
  finishedAt: Date | null;
};

export class CommunicationDispatchEntity {
  private constructor(readonly props: CommunicationDispatchesProps) {}

  public static create(communicationId: string) {
    return new CommunicationDispatchEntity({
      id: crypto.randomUUID(),
      communicationId,
      attemptNumber: 1,
      provider: EMAIL_PROVIDERS.RESEND,
      status: COMMUNICATION_DISPATCH_STATUSES.PROCESSING,
      startedAt: new Date(),
      finishedAt: null,
    });
  }

  public static createWithNewProvider(communicationId: string, provider: EmailProviderName) {
    return new CommunicationDispatchEntity({
      id: crypto.randomUUID(),
      communicationId,
      attemptNumber: 1,
      provider,
      status: COMMUNICATION_DISPATCH_STATUSES.PROCESSING,
      startedAt: new Date(),
      finishedAt: null,
    });
  }

  public static fromPersistence(props: CommunicationDispatchesProps) {
    return new CommunicationDispatchEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get communicationId() {
    return this.props.communicationId;
  }

  get attemptNumber() {
    return this.props.attemptNumber;
  }

  get provider() {
    return this.props.provider;
  }

  get status() {
    return this.props.status;
  }

  get startedAt() {
    return this.props.startedAt;
  }

  get finishedAt() {
    return this.props.finishedAt;
  }

  public incrementAttempt() {
    if (this.props.attemptNumber >= 3) {
      throw new Error('Cannot increment attempt beyond 3');
    }
    this.props.attemptNumber++;
    this.props.status = COMMUNICATION_DISPATCH_STATUSES.PROCESSING;
    this.props.startedAt = new Date();
    this.props.finishedAt = null;
  }

  public markAsSent() {
    if (this.props.status !== COMMUNICATION_DISPATCH_STATUSES.PROCESSING) {
      throw new Error('Cannot mark as sent a dispatch that is not processing');
    }

    this.props.status = COMMUNICATION_DISPATCH_STATUSES.SENT;
    this.props.finishedAt = new Date();
  }

  public markAsFailed() {
    if (this.props.status !== COMMUNICATION_DISPATCH_STATUSES.PROCESSING) {
      throw new Error('Cannot mark as failed a dispatch that is not processing');
    }

    this.props.status = COMMUNICATION_DISPATCH_STATUSES.FAILED;
    this.props.finishedAt = new Date();
  }

  public isFinished(): boolean {
    return (
      this.props.status === COMMUNICATION_DISPATCH_STATUSES.SENT ||
      this.props.status === COMMUNICATION_DISPATCH_STATUSES.FAILED
    );
  }

  public isProcessing(): boolean {
    return this.props.status === COMMUNICATION_DISPATCH_STATUSES.PROCESSING;
  }

  public canIncrementAttempt(): boolean {
    return this.props.status === COMMUNICATION_DISPATCH_STATUSES.FAILED && this.props.attemptNumber < 3;
  }

  public needsNewProvider(): boolean {
    return this.props.status === COMMUNICATION_DISPATCH_STATUSES.FAILED && this.props.attemptNumber >= 3;
  }
}
