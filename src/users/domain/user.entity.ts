export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserEntity {
  private constructor(readonly props: UserProps) {}

  public static create(name: string, email: string, password: string) {
    return new UserEntity({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromPersistence(props: UserProps) {
    return new UserEntity(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
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
}