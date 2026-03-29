export type TemplateProps = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class TemplateEntity {
  private constructor(readonly props: TemplateProps) {}

  public static create(name: string, description?: string | null) {
    return new TemplateEntity({
      id: crypto.randomUUID(),
      name,
      description: description ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromPersistence(props: TemplateProps) {
    return new TemplateEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
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

  public updateName(name: string) {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description: string | null) {
    this.props.description = description;
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
