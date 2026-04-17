export type TemplateVariableValue = string | number | boolean;

export type CommunicationProps = {
  id: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'teams';
  sourceType: 'manual' | 'template';
  status: 'draft' | 'scheduled' | 'processing' | 'sent' | 'failed' | 'canceled';
  subject: string | null;
  body: string | null;
  bodyType: 'text' | 'html' | null;
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
    channel: 'email' | 'whatsapp' | 'sms' | 'teams',
    sourceType: 'manual' | 'template',
    status: 'draft' | 'scheduled' | 'processing' | 'sent' | 'failed' | 'canceled',
    subject?: string | null,
    body?: string | null,
    bodyType?: 'text' | 'html' | null,
    templateVersionId?: string | null,
    templateVariablesJson?: Record<string, TemplateVariableValue> | null,
    scheduledAt?: Date | null,
    createdByUserId?: string | null,
  ) {
    if (sourceType === 'template' && !templateVersionId) {
      throw new Error('Template version ID is required when source type is template');
    }

    return new CommunicationEntity({
      id: crypto.randomUUID(),
      channel,
      sourceType,
      status,
      subject: subject ?? null,
      body: body ?? null,
      bodyType: bodyType ?? null,
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

  get bodyType() {
    return this.props.bodyType;
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
    this.props.status = 'scheduled';
    this.props.scheduledAt = scheduledAt;
    this.props.updatedAt = new Date();
  }

  public startProcessing() {
    this.props.status = 'processing';
    this.props.processingAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markAsSent() {
    this.props.status = 'sent';
    this.props.sentAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markAsFailed() {
    this.props.status = 'failed';
    this.props.updatedAt = new Date();
  }

  public cancel() {
    if (this.props.status === 'draft' || this.props.status === 'scheduled') {
      this.props.status = 'canceled';
      this.props.updatedAt = new Date();
    } else {
      throw new Error('Cannot cancel a communication that is not in draft or scheduled status');
    }
  }

  public updateSubject(subject: string) {
    if (this.props.status !== 'draft' && this.props.status !== 'scheduled') {
      throw new Error('Cannot update subject after communication is queued, processing, sent, failed or canceled');
    }
    this.props.subject = subject;
    this.props.updatedAt = new Date();
  }

  public updateBody(body: string) {
    if (this.props.status !== 'draft' && this.props.status !== 'scheduled') {
      throw new Error('Cannot update body after communication is queued, processing, sent, failed or canceled');
    }
    this.props.body = body;
    this.props.updatedAt = new Date();
  }

  public updateBodyType(bodyType: 'text' | 'html') {
    if (this.props.status !== 'draft' && this.props.status !== 'scheduled') {
      throw new Error('Cannot update body type after communication is queued, processing, sent, failed or canceled');
    }
    this.props.bodyType = bodyType;
    this.props.updatedAt = new Date();
  }

  public updateTemplateVariables(variables: Record<string, TemplateVariableValue>) {
    if (this.props.status !== 'draft' && this.props.status !== 'scheduled') {
      throw new Error(
        'Cannot update template variables after communication is queued, processing, sent, failed or canceled',
      );
    }
    this.props.templateVariablesJson = variables;
    this.props.updatedAt = new Date();
  }

  public updateScheduledAt(scheduledAt: Date | null) {
    if (this.props.status !== 'draft' && this.props.status !== 'scheduled') {
      throw new Error(
        'Cannot update scheduled date after communication is queued, processing, sent, failed or canceled',
      );
    }
    this.props.scheduledAt = scheduledAt;
    this.props.updatedAt = new Date();
  }
}
