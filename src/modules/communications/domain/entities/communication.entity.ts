import {
  COMMUNICATION_SOURCE_TYPES,
  COMMUNICATION_STATUSES,
  CommunicationChannel,
  CommunicationSourceType,
  CommunicationStatus,
} from '../communication.constants';

export type TemplateVariableValue = string | number | boolean | Date;

export type CommunicationProps = {
  id: string;
  channel: CommunicationChannel;
  sourceType: CommunicationSourceType;
  status: CommunicationStatus;
  subject: string | null;
  body: string | null;
  templateVersionId: string | null;
  templateVariablesJson: Record<string, TemplateVariableValue> | null;
  scheduledAt: Date | null;
  processingAt: Date | null;
  sentAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class CommunicationEntity {
  private constructor(readonly props: CommunicationProps) {}

  public static create(
    channel: CommunicationChannel,
    sourceType: CommunicationSourceType,
    status: CommunicationStatus,
    subject?: string | null,
    body?: string | null,
    templateVersionId?: string | null,
    templateVariablesJson?: Record<string, TemplateVariableValue> | null,
    scheduledAt?: Date | null,
    createdByUserId?: string | null,
  ) {
    if (sourceType === COMMUNICATION_SOURCE_TYPES.TEMPLATE && !templateVersionId) {
      throw new Error('Template version ID is required when source type is template');
    }

    return new CommunicationEntity({
      id: crypto.randomUUID(),
      channel,
      sourceType,
      status,
      subject: subject ?? null,
      body: body ?? null,
      templateVersionId: templateVersionId ?? null,
      templateVariablesJson: templateVariablesJson ?? null,
      scheduledAt: scheduledAt ?? null,
      processingAt: null,
      sentAt: null,
      createdByUserId: createdByUserId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromPersistence(props: CommunicationProps) {
    return new CommunicationEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get channel() {
    return this.props.channel;
  }

  get sourceType() {
    return this.props.sourceType;
  }

  get status() {
    return this.props.status;
  }

  get subject() {
    return this.props.subject;
  }

  get body() {
    return this.props.body;
  }

  get templateVersionId() {
    return this.props.templateVersionId;
  }

  get templateVariablesJson() {
    return this.props.templateVariablesJson;
  }

  get scheduledAt() {
    return this.props.scheduledAt;
  }

  get processingAt() {
    return this.props.processingAt;
  }

  get sentAt() {
    return this.props.sentAt;
  }

  get createdByUserId() {
    return this.props.createdByUserId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public schedule(scheduledAt: Date) {
    this.props.status = COMMUNICATION_STATUSES.SCHEDULED;
    this.props.scheduledAt = scheduledAt;
    this.props.updatedAt = new Date();
  }

  public markAsProcessing(): void {
    this.props.status = COMMUNICATION_STATUSES.PROCESSING;
    this.props.processingAt = new Date();
  }

  public markAsSent() {
    this.props.status = COMMUNICATION_STATUSES.SENT;
    this.props.sentAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markAsFailed() {
    this.props.status = COMMUNICATION_STATUSES.FAILED;
    this.props.updatedAt = new Date();
  }

  public cancel() {
    if (this.props.status === COMMUNICATION_STATUSES.SCHEDULED) {
      this.props.status = COMMUNICATION_STATUSES.CANCELED;
      this.props.updatedAt = new Date();
    } else {
      throw new Error('Cannot cancel a communication that is not in scheduled status');
    }
  }

  public updateSubject(subject: string) {
    if (this.props.status !== COMMUNICATION_STATUSES.SCHEDULED) {
      throw new Error('Cannot update subject after communication is queued, processing, sent, failed or canceled');
    }
    this.props.subject = subject;
    this.props.updatedAt = new Date();
  }

  public updateBody(body: string) {
    if (this.props.status !== COMMUNICATION_STATUSES.SCHEDULED) {
      throw new Error('Cannot update body after communication is queued, processing, sent, failed or canceled');
    }
    this.props.body = body;
    this.props.updatedAt = new Date();
  }

  public updateTemplateVariables(variables: Record<string, TemplateVariableValue>) {
    if (this.props.status !== COMMUNICATION_STATUSES.SCHEDULED) {
      throw new Error(
        'Cannot update template variables after communication is queued, processing, sent, failed or canceled',
      );
    }
    this.props.templateVariablesJson = variables;
    this.props.updatedAt = new Date();
  }

  public updateScheduledAt(scheduledAt: Date | null) {
    if (this.props.status !== COMMUNICATION_STATUSES.SCHEDULED) {
      throw new Error(
        'Cannot update scheduled date after communication is queued, processing, sent, failed or canceled',
      );
    }
    this.props.scheduledAt = scheduledAt;
    this.props.updatedAt = new Date();
  }
}
