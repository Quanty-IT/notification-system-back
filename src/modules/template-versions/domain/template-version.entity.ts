export type TemplateVersionVariableType = 'string' | 'number' | 'boolean';

export type TemplateVersionProps = {
  id: string;
  templateId: string;
  version: number;
  subject: string;
  body: string;
  variablesSchemaJson: Record<string, TemplateVersionVariableType> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class TemplateVersionEntity {
  private constructor(readonly props: TemplateVersionProps) {}

  public static create(
    templateId: string,
    version: number,
    subject: string,
    body: string,
    variablesSchemaJson?: Record<string, TemplateVersionVariableType> | null,
  ) {
    return new TemplateVersionEntity({
      id: crypto.randomUUID(),
      templateId,
      version,
      subject,
      body,
      variablesSchemaJson: variablesSchemaJson ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromPersistence(props: TemplateVersionProps) {
    return new TemplateVersionEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get templateId() {
    return this.props.templateId;
  }

  get version() {
    return this.props.version;
  }

  get subject() {
    return this.props.subject;
  }

  get body() {
    return this.props.body;
  }

  get variablesSchemaJson() {
    return this.props.variablesSchemaJson;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public updateSubject(subject: string) {
    this.props.subject = subject;
    this.props.updatedAt = new Date();
  }

  public updateBody(body: string) {
    this.props.body = body;
    this.props.updatedAt = new Date();
  }

  public updateVariablesSchemaJson(variablesSchemaJson: Record<string, TemplateVersionVariableType> | null) {
    this.props.variablesSchemaJson = variablesSchemaJson;
    this.props.updatedAt = new Date();
  }

  public activate() {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public deactivate() {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
