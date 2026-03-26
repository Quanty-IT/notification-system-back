import { HashProvider } from "@/infra/cryptography/hash.provider";
import createHttpError from "http-errors";
import { UserEntity } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";
import {
  CreateUserInput,
  CreateUserOutput,
  FindAllUsersOutput,
  GetUserOutput,
  UpdateUserInput,
  UpdateUserOutput,
} from "./user.dto";

export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    const userExists = await this.repository.findByEmail(input.email);

    if (userExists) {
      throw new createHttpError.Conflict(`User with email ${input.email} already exists`);
    }

    const hashedPassword = await this.hashProvider.hash(input.password);

    const user = UserEntity.create(
      input.name,
      input.email,
      hashedPassword
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
      throw new createHttpError.NotFound(`User ${id} not found`);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new createHttpError.NotFound(`User ${id} not found`);
    }

    if (input.name) {
      user.updateName(input.name);
    }

    if (input.email && input.email !== user.email) {
      const userWithSameEmail = await this.repository.findByEmail(input.email);

      if (userWithSameEmail) {
        throw new createHttpError.Conflict(`User with email ${input.email} already exists`);
      }
      
      user.updateEmail(input.email);
    }

    await this.repository.update(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new createHttpError.NotFound(`User ${id} not found`);
    }

    await this.repository.delete(id);
  }
}