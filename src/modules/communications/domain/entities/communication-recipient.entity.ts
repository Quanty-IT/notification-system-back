export type RecipientType = 'to' | 'cc' | 'bcc';

export type CommunicationRecipientProps = {
  id: string;
  communicationId: string;
  recipientType: RecipientType;
  email: string;
  createdAt: Date;
};

export class CommunicationRecipientEntity {
  private constructor(readonly props: CommunicationRecipientProps) {}

  public static create(communicationId: string, recipientType: RecipientType, email: string) {
    return new CommunicationRecipientEntity({
      id: crypto.randomUUID(),
      communicationId,
      recipientType,
      email,
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: CommunicationRecipientProps) {
    return new CommunicationRecipientEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get communicationId() {
    return this.props.communicationId;
  }

  get recipientType() {
    return this.props.recipientType;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
