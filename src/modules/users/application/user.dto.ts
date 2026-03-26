import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.schemas';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserOutput = UserOutput;
export type UpdateUserOutput = UserOutput;

export type GetUserOutput = UserOutput;

export type FindAllUsersOutput = {
  users: UserOutput[];
};
