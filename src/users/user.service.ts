import { CreateUserInput, CreateUserOutput, FindAllUsersOutput, GetUserOutput, UpdateUserInput } from "./user.dto";
import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = UserEntity.create(
      input.name,
      input.email,
      input.password
    );

    await this.repository.create(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<FindAllUsersOutput> {
    const users = await this.repository.findAll();

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
  }

  async findById(id: string): Promise<GetUserOutput> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error(`User ${id} not found`);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(input: UpdateUserInput): Promise<UpdateUserInput> {
    const user = await this.repository.findById(input.id);

    if (!user) {
      throw new Error(`User ${input.id} not found`);
    }

    if (input.name) {
      user.updateName(input.name);
    }

    await this.repository.update(user);
    
    return {
      id: user.id,
      name: user.name,
    };
  }

  async delete(id: string): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error(`User ${id} not found`);
    }

    return await this.repository.delete(id);
  }
}