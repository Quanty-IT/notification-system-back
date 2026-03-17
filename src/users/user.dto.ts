export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindAllUsersOutput = {
  users: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type GetUserOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserInput = {
  id: string;
  name: string;
};

export type UpdateUserOutput = {
  id: string;
  name: string;
};