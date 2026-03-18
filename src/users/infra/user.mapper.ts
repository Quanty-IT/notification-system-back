import { User as PrismaUser } from "../../../generated/prisma/client";
import { UserEntity } from "../domain/user.entity";

export class UserMapper {
  static toDomain(user: PrismaUser): UserEntity {
    return UserEntity.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  static toPersistence(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}