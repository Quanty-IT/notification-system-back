import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../domain/user.entity';

export class UserMapper {
  static toDomain(user: PrismaUser): UserEntity {
    return UserEntity.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  }

  static toPersistence(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
