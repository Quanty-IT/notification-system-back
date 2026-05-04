export type CommunicationDispatchesProps = {
  id: string;
  communicationId: string;
  attemptNumber: number;
  provider: 'smtp' | 'nodemailer' | 'twilio';
  status: 'processing' | 'sent' | 'failed';
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
      provider: 'smtp',
      status: 'processing',
      startedAt: new Date(),
      finishedAt: null,
    });
  }

  public static createWithNewProvider(communicationId: string, provider: 'smtp' | 'nodemailer' | 'twilio') {
    return new CommunicationDispatchEntity({
      id: crypto.randomUUID(),
      communicationId,
      attemptNumber: 1,
      provider,
      status: 'processing',
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
    this.props.status = 'processing';
    this.props.startedAt = new Date();
    this.props.finishedAt = null;
  }

  public markAsSent() {
    if (this.props.status !== 'processing') {
      throw new Error('Cannot mark as sent a dispatch that is not processing');
    }

    this.props.status = 'sent';
    this.props.finishedAt = new Date();
  }

  public markAsFailed() {
    if (this.props.status !== 'processing') {
      throw new Error('Cannot mark as failed a dispatch that is not processing');
    }

    this.props.status = 'failed';
    this.props.finishedAt = new Date();
  }

  public isFinished(): boolean {
    return this.props.status === 'sent' || this.props.status === 'failed';
  }

  public isProcessing(): boolean {
    return this.props.status === 'processing';
  }

  public canIncrementAttempt(): boolean {
    return this.props.status === 'failed' && this.props.attemptNumber < 3;
  }

  public needsNewProvider(): boolean {
    return this.props.status === 'failed' && this.props.attemptNumber >= 3;
  }
}
